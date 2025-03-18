const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/', userRoutes);

// Start the server
const PORT = process.env.PORT || 3636;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
