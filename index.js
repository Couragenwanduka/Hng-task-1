import express from 'express';
import dotenv from 'dotenv';
import router from './src/router/router.js';
import extractIpAddress from './src/middlewares/accessIpAddress.js';

dotenv.config();
const app = express();
const Port = process.env.PORT || 8000;

// Use the IP extraction middleware
app.use(extractIpAddress);

app.use('/', router);

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
