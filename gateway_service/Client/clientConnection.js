const { redisClientSocket } = require("../redis/redis");
const { handleClientReconnection } = require("./clientReconnection");

const handleClientConnection = async (socket) => {
    const { phone_number, user_type, } = socket.user;

    console.log(`New connection: Socket ID ${socket.id}, Phone Number: ${phone_number}, User Type: ${user_type}`);

    // Store only the socket ID and user type in Redis
    await redisClientSocket.hmset(phone_number, {
        socketId: socket.id,
        userType: user_type
    });
    
    handleClientReconnection(socket);

};

module.exports = {
    handleClientConnection,
};
