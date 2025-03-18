const express = require('express');
const { findMatches } = require('./config/findMatches.js');
const app = express();
app.use(express.json());


setInterval(() => {
    console.log('Searching for matches...');
    findMatches();
}, 10000); // Adjust the timing as needed

// Start the microservice
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
    console.log(`Matching service running on port ${PORT}`);
});