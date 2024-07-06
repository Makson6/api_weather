import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json())
const port = process.env.PORT;


app.get('/api/hello', async function (req, res) {

  try {
    const visitorName = req.query.visitor_name;
    const APIKEY = process.env.APIKEY
    const clientIP =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";
    const resp = await axios.get(`http://ip-api.com/json/${clientIP}`);

    const { city } = resp.data || 'Goma';
    const weatherResp = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKEY}`
    );
    const temp = weatherResp.data.main.temp;
    res.status(200).json({
      client_id: clientIP,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temp} degrees Celsuis in ${city}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.use('*', function (req, res) {
  res.status(404).json({
    message: 'https://api-weather-psi.vercel.app/api/hello?visitor_name=David',

  })
});


app.listen(port);