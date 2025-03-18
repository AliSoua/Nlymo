const express = require('express');
const http = require('http');
const helmet = require('helmet');
const { initSocket } = require('./sockets/initSockets'); // Import the initSocket function
require('dotenv').config();
const notifyRoutes = require('./routes/notify'); // Import the notify routes
const app = express();
const server = http.createServer(app);
const os = require('os');


// Middleware to parse JSON
app.use(express.json());

// Use Helmet for security headers
app.use(helmet());

// Use the notify route for /api path
app.use('/', notifyRoutes);


// Initialize socket connections, passing the server and shared state
initSocket(server, );

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3003;

const getIPAddresses = () => {
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];
  for (let interface in networkInterfaces) {
    networkInterfaces[interface].forEach((details) => {
      if (details.family === 'IPv4' && !details.internal) {
        addresses.push(details.address);
      }
    });
  }
  return addresses;
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  const addresses = getIPAddresses();
  addresses.forEach((address) => {
    console.log(`Gateway is accessible at http://${address}:${PORT}`);
  });
});
