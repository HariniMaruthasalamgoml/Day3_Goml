const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

// Schema and Model for API Key
const apiKeySchema = new mongoose.Schema({
    key: String,
    createdAt: { type: Date, default: Date.now },
});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

// Schema and Model for News
const newsSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    publishedAt: { type: Date, default: Date.now },
    source: String,
});

const News = mongoose.model('News', newsSchema);

// Route to get the API key
app.get('/api/key', async (req, res) => {
    try {
        const apiKey = await ApiKey.findOne();
        res.json({ apiKey: apiKey.key });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching API key' });
    }
});

// Route to fetch weather data
app.get('/api/weather', async (req, res) => {
    const { lat, lon } = req.query;

    try {
        const apiKey = await ApiKey.findOne();
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                lat,
                lon,
                units: 'metric',
                appid: apiKey.key,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.get('/api/news', async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY; // Replace with your News API key
        const response = await axios.get('https://timesofindia.indiatimes.com/city/coimbatore', {
            params: {
                country: 'us', // Example: Fetch news from US
                apiKey: apiKey,
            },
        });

        const articles = response.data.articles;
        res.json(articles);
    } catch (error) {
        console.error('Error fetching news articles:', error);
        res.status(500).json({ error: 'Error fetching news articles' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

