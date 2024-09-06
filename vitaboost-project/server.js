require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Define Subscriber schema
const subscriberSchema = new mongoose.Schema({
    email: String,
    subscription: String,
    date: { type: Date, default: Date.now }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/subscribe', async (req, res) => {
    const { email, subscription } = req.body;

    try {
        const subscriber = new Subscriber({ email, subscription });
        await subscriber.save();
        console.log('New subscriber:', { email, subscription });
        res.json({ message: 'Thank you for subscribing! We\'ll notify you when the product is available.' });
    } catch (error) {
        console.error('Error saving subscriber:', error);
        res.status(500).json({ message: 'An error occurred while subscribing. Please try again.' });
    }
});
// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});