const { redisRideRequest, redisDriverPosition } = require('../redis/redisClient.js');


const fetchAllDrivers = async () => {
    const driverKeys = await redisDriverPosition.keys('*');
    const drivers = await Promise.all(driverKeys.map(key => redisDriverPosition.hgetall(key)));
    return drivers.map((driver, index) => ({ ...driver, phone_number: driverKeys[index] }));
};

const fetchAllClients = async () => {
    const clientKeys = await redisRideRequest.keys('*');
    const clients = await Promise.all(clientKeys.map(key => redisRideRequest.hgetall(key)));
    return clients.map((client, index) => ({ ...client, phone_number: clientKeys[index] }));
};

module.exports = {
    fetchAllClients,
    fetchAllDrivers
}