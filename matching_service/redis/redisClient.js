const Redis = require('ioredis');

// Client Redis
const redisClientSocket = new Redis({ port: 6388 }); // Client socket data
const redisRideRequest = new Redis({ port: 6390 }); // Ride requests

// Driver Redis
const redisDriverSocket = new Redis({ port: 6389 }); // Driver socket data
const redisDriverPosition = new Redis({ port: 6391 }); // Driver positions

// Driver Redis
const redisMatchClient = new Redis({ port: 6392 }); // Driver socket data
const redisMatchDriver = new Redis({ port: 6393 }); // Driver socket data

const redisBanSystem = new Redis({ port: 6394 }); // Driver socket data


module.exports = {
    redisBanSystem,
    redisClientSocket,
    redisRideRequest,
    redisDriverSocket,
    redisDriverPosition,
    redisMatchClient,
    redisMatchDriver
};
