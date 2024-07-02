import axios from 'axios';

export const user = async (req, res) => {
    try {
        const userName = req.query.visitorName;
        if (!userName) {
            return res.status(400).json({ message: 'Visitor name is required' });
        }

        // Retrieve client's IP address from req.headers or req.socket
        let clientsIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        
        // Log the IP address for debugging
        console.log('Client IP:', clientsIp);

        // For testing purposes, use a static IP like '8.8.8.8'
        // In production, use the real client IP
        const testIP = clientsIp === '::1' ? '8.8.8.8' : clientsIp;

        // Handle IPv6-mapped IPv4 addresses
        if (testIP.includes('::ffff:')) {
            clientsIp = testIP.split(':').pop();
        }

        console.log('IP for geolocation:', clientsIp);

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
