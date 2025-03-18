const { redisDriverSocket } = require("../redis/redis");
const { handleDriverReconnection } = require("./driverReconnection");


const handleDriverConnection = async (socket) => {
    const { phone_number, user_type, } = socket.user;

    console.log(`New connection: Socket ID ${socket.id}, Phone Number: ${phone_number}, User Type: ${user_type}`);

    // Store only the socket ID and user type in Redis
    await redisDriverSocket.hmset(phone_number, {
        socketId: socket.id,
        userType: user_type
    });
    
    handleDriverReconnection(socket);

};

module.exports = {
    handleDriverConnection,
};
