import express from 'express';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Configure dotenv
config();

// Workaround for __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Endpoint to get the API key
app.get('/api/key', (req, res) => {
    res.json({ apiKey: process.env.API_KEY });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
