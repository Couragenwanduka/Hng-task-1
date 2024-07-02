import axios from 'axios';

export const user = async (req, res) => {
    try {
        const userName = req.query.visitorName;
        if (!userName) {
            return res.status(400).json({ message: 'Visitor name is required' });
        }

        // Retrieve client's IP address from req.headers or req.socket
        let clientsIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

        // Handle multiple IP addresses in x-forwarded-for header
        if (clientsIp.includes(',')) {
            clientsIp = clientsIp.split(',')[0].trim();
        }

        // Handle IPv6-mapped IPv4 addresses
        if (clientsIp.includes('::ffff:')) {
            clientsIp = clientsIp.split(':').pop();
        }

        // Log the IP address for debugging
        console.log('Client IP:', clientsIp);

        const geoResponse = await axios.get(`https://ipapi.co/${clientsIp}/json/`);
        if (geoResponse.data.error) throw new Error('Unable to geolocate IP address.');

        const { latitude, longitude, city, region, country_name } = geoResponse.data;
        console.log('Geolocation data:', { latitude, longitude, city, region, country_name });

        // Ensure you have the API key
        const weatherApiKey = process.env.WEATHER_APP_API_KEY;
        if (!weatherApiKey) throw new Error('Weather API key is not set.');

        const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                lat: latitude,
                lon: longitude,
                appid: weatherApiKey,
                units: 'metric'
            }
        });

        const weatherData = weatherResponse.data;
        console.log('Weather data:', weatherData);

        return res.status(200).json({
            clientsIp,
            visitorName: userName,
            location: {
                city,
                region,
                country: country_name,
                latitude,
                longitude
            },
            weather: {
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};
