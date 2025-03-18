const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const os = require('os');
require('dotenv').config();

const app = express();

const userRoutes = require('./routes/userRoutes');

app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/', userRoutes);

app.post('/submit', (req, res) => {
  const data = req.body;
  console.log('Received data:', data);
  res.status(200).json({
    message: 'Data received successfully',
    receivedData: data,
  });
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  const addresses = getIPAddresses();
  addresses.forEach((address) => {
    console.log(`Server is accessible at http://${address}:${PORT}`);
  });
});
