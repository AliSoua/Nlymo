const { redisRideRequest, redisDriverPosition } = require('../redis/redisClient.js');

const removeDriver = async (driver) => {
    try {
        const driverKey = driver.phone_number; // Use phone_number directly as the key
        const result = await redisDriverPosition.del(driverKey); // Remove driver from Redis
        if (result === 1) {
            console.log(`Driver with phone number ${driver.phone_number} removed from Redis.`);
        } else {
            console.log(`Driver with phone number ${driver.phone_number} not found in Redis.`);
        }
    } catch (error) {
        console.error(`Error removing driver: ${error.message}`);
    }
    
};

const removeClient = async (client) => {
    try {
        const clientKey = client.phone_number; // Use phone_number directly as the key
        const result = await redisRideRequest.del(clientKey); // Remove client from Redis
        if (result === 1) {
            console.log(`Client with phone number ${client.phone_number} removed from Redis.`);
        } else {
            console.log(`Client with phone number ${client.phone_number} not found in Redis.`);
        }
    } catch (error) {
        console.error(`Error removing client: ${error.message}`);
    }
};

module.exports = {
    removeDriver,
    removeClient
};
