const { redisMatchDriver, redisMatchClient, redisclientSocket, redisClientSocket } = require('../../redis/redis');
const SocketManager = require('../../sockets/socketClass'); // Import SocketManager
const { cancel_Course_db } = require('./cancelCourse_db');



const DriverCancelRide = async (socket) => {
    const io = SocketManager.getInstance(); // Get the socket.io instance

    socket.on('cancel_ride_driver', async (data) => {
        console.log(data);
        console.log("Cancel ride driver");
        console.log(`Driver Phone Number drivercancelride: ${socket.user.phone_number}`);

        try {
            // Get the client's ride based on the driver's phone number
            const clientRide = await redisMatchDriver.hgetall(socket.user.phone_number);
            console.log(clientRide)
            if (!clientRide || !clientRide.phone_number) {
                console.log(`No Driver found for Client ${socket.user.phone_number}.`);
                return;
            }

            console.log(`Client Phone Number: ${clientRide.phone_number}, ${clientRide}`);


            // Remove the client and driver from Redis
            await redisMatchClient.del(clientRide.phone_number);
            await redisMatchDriver.del(socket.user.phone_number);

            // Retrieve the Client's socket ID from Redis
            const ClientSocketData = await redisClientSocket.hgetall(clientRide.phone_number);
            if (!ClientSocketData || !ClientSocketData.socketId) {
                console.log(`Driver socket for phone number ${clientRide.phone_number} not found.`);
                return;
            }

            // Get the client's socket
            const clientSocket = io.sockets.sockets.get(ClientSocketData.socketId);

            console.log("this is the client socket :",clientSocket)
            if (clientSocket) {
                // Emit the cancellation event to the driver
                await clientSocket.emit('cancel_ride_fromdriver', data);
                //await addBan(socket.user.phone_number, clientSocket.user.phone_number);             
                await cancel_Course_db(socket.user.phone_number, clientRide.phone_number );

                console.log(`Cancellation request sent to Client ${clientRide.phone_number}.`);
            } else {
                console.log(`Driver socket for phone number ${clientRide.phone_number} not found.`);
            }
        } catch (error) {
            console.error('Error handling cancel ride client:', error);
        }
    });
}

module.exports = {
    DriverCancelRide
};
