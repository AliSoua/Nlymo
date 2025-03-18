const { addBan } = require('../../Ban/banSystem');
const { redisMatchDriver, redisMatchClient, redisDriverSocket } = require('../../redis/redis');
const SocketManager = require('../../sockets/socketClass'); // Import SocketManager
const { cancel_Course_db } = require('./cancelCourse_db');

const clientCancelRide = async (socket) => {
    const io = SocketManager.getInstance(); // Get the socket.io instance

    socket.on('cancel_ride_client', async (data) => {
        console.log("Cancel ride client");
        console.log(`Client Phone Number clientcancelride: ${socket.user.phone_number}`);
         
        try {
            // Get the driver's position based on the client's phone number
            const driverPosition = await redisMatchClient.hgetall(socket.user.phone_number);
            console.log(driverPosition)
            if (!driverPosition || !driverPosition.phone_number) {
                console.log(`No driver found for client ${socket.user.phone_number}.`);
                return;
            }

            console.log(`Driver Phone Number: ${driverPosition.phone_number}, ${driverPosition}`);

            // Remove the client and driver from Redis
            await redisMatchClient.del(socket.user.phone_number);
            await redisMatchDriver.del(driverPosition.phone_number);    

            // Retrieve the driver's socket ID from Redis
            const driverSocketData = await redisDriverSocket.hgetall(driverPosition.phone_number);
            if (!driverSocketData || !driverSocketData.socketId) {
                console.log(`Driver socket for phone number ${driverPosition.phone_number} not found.`);
                return;
            }
            const driverSocket = io.sockets.sockets.get(driverSocketData.socketId);

            if (driverSocket) {
                // Emit the cancellation event to the driver
                await driverSocket.emit('cancel_ride_fromclient', data);
                await cancel_Course_db(driverPosition.phone_number, socket.user.phone_number);

                console.log(`Cancellation request sent to driver ${driverPosition.phone_number}.`);
            } else {
                console.log(`Active socket for driver ${driverPosition.phone_number} not found.`);
            }
        } catch (error) {
            console.error('Error handling cancel ride client:', error);
        }
    });
}

module.exports = {
    clientCancelRide
};
