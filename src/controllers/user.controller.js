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

       

        const geoResponse = await axios.get(`https://ipapi.co/${clientsIp}/json/`);
        if (geoResponse.data.error) throw new Error('Unable to geolocate IP address.');

        const { latitude, longitude, city, region, country_name } = geoResponse.data;
       
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
        

       return res.status(200).json({
            clients_sIp:clientsIp,
            location: {
                city,
                region,
                country: country_name,
                latitude,
                longitude
            },
            geetings: {
                greetings: `Hello, ${userName}!, the temperature is ${weatherData.main.temp}, in ${city}`,
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};
