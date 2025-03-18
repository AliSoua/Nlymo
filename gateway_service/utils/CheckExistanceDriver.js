const { redisDriverSocket } = require('../redis/redis');

const checkExistanceDriver = async (socket) => {
    const { phone_number } = socket.user;
    console.log(socket.user);

    try {
        // Use hget to retrieve the socketId from a hash
        const existingSocketId = await redisDriverSocket.hget(phone_number, 'socketId');
        if (existingSocketId) {
            console.log(`Disconnecting previous connection for phone number: ${phone_number}`);
            const existingSocket = socket.nsp.sockets.get(existingSocketId);
            if (existingSocket) {
                existingSocket.disconnect();
                console.log(`Disconnected previous socket ID: ${existingSocketId}`);
            } else {
                console.log(`Socket ID ${existingSocketId} not found.`);
            }
        }
    } catch (error) {
        console.error('Error fetching socket ID from Redis:', error);
    }
};

module.exports = {
    checkExistanceDriver
};
