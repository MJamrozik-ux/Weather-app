import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors()); 

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const API_KEY = process.env.API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=en`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
console.log("API KEY:", process.env.API_KEY);
app.listen(3000, () => console.log("Server działa"));