const { redisDriverPosition, redisDriverSocket } = require('../redis/redis')

const disconnectDriver = async (socket) => {
    socket.on('disconnect', async () => {
        await redisDriverSocket.del(socket.user.phone_number);
        await redisDriverPosition.del(socket.user.phone_number);  
    });

};

module.exports = {
    disconnectDriver
};
