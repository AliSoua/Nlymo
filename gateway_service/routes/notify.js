const express = require('express');
const { apiCallMatch } = require('../notificationMatch/apiCallMatch'); // Adjust the path as necessary
const { redisDriverSocket } = require('../redis/redis'); // Adjust the path as necessary

const router = express.Router();

// POST /api/notify
router.post('/api/notify', async (req, res) => {
  const { driverPhone, clientData, message } = req.body;
  console.log(req.body)
  // Log the notification
  console.log(`Notification for Driver ${driverPhone}: ${message} (Client: ${clientData})`);
  
  try {
    // Retrieve the driver's socket data from Redis
    const driverSocketData = await redisDriverSocket.hgetall(driverPhone);
    
    if (!driverSocketData || !driverSocketData.socketId) {
      return res.status(404).json({ error: 'Driver socket not found' });
    }

    // Pass the driver's socket data and client data to the API call
    apiCallMatch(driverSocketData.socketId, clientData);

    // Send a success response
    res.status(200).json({ status: 'success', message: 'Notification sent to driver' });

  } catch (error) {
    console.error('Error fetching driver socket or sending notification:', error);
    res.status(500).json({ error: 'Failed to notify driver' });
  }
});

module.exports = router;
