const { redisRideRequest, redisClientSocket } = require('../redis/redis')



const disconnectClient = async (socket) => {
    socket.on('disconnect', async () => {
        await redisClientSocket.del(socket.user.phone_number);
        await redisRideRequest.del(socket.user.phone_number);  
    });
};

module.exports = {
    disconnectClient
};
