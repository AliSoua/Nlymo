const { redisClientSocket, redisClient } = require("../../redis/redis");


const handleClientConnection = async (socket) => {
    const { phone_number, user_type, } = socket.user;

    console.log(`New connection: Socket ID ${socket.id}, Phone Number: ${phone_number}, User Type: ${user_type}`);

    const existingSocketId = await redisClient.get(phone_number);
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

    // Store only the socket ID and user type in Redis
    await redisClientSocket.hmset(phone_number, {
        socketId: socket.id,
        userType: user_type
    });
    
};

module.exports = {
    handleClientConnection,
};
