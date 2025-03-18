const { redisMatchDriver, redisMatchClient, redisDriverSocket, redisRideRequest } = require('../redis/redis');
const socketClass = require('../sockets/socketClass');
const { addBan } = require('../Ban/banSystem');
const { cancel_Course_db } = require('../Ride/cancelRide/cancelCourse_db');
// Import the cancel_Course_db function from the correct file


const clientCancelInDemand = async (socket) => {
    io = socketClass.getInstance();
    socket.on("cancel_request", async (data) => {
        console.log("cancel_request client is getting called");
        try {
            console.log(socket.user);

            const clientPhoneNumber = socket.user.phone_number;
            console.log(`Client Phone Number: ${clientPhoneNumber}`);

            // Get the driver's position based on the client phone number
            const driverPosition = await redisMatchClient.hgetall(clientPhoneNumber);
            
            // Check if driverPosition is valid
            if (!driverPosition || Object.keys(driverPosition).length === 0) {
                console.log(`No driver found for client ${clientPhoneNumber}. Redis cleanup not required.`);
                await redisRideRequest.del(clientPhoneNumber);  // Cleanup client ride request
                return;
            }

            console.log(`Driver Phone Number: ${driverPosition.phone_number}`);

            await redisRideRequest.del(clientPhoneNumber);
            console.log(driverPosition);

            // Get the driver's socket based on the phone number from driverPosition
            const driverSocket = await redisDriverSocket.hgetall(driverPosition.phone_number);
            console.log(driverSocket);
            
            if (driverSocket && driverSocket.socketId) {
                // Emit the cancel request to the driver
                await io.to(driverSocket.socketId).emit("cancel_request_received", data);
                console.log("this should be the driver phone number :",driverPosition.phone_number)
                await cancel_Course_db(clientPhoneNumber, driverPosition.phone_number); // Ensure this function is defined and correctly imported
                console.log(`Cancel request sent to driver ${driverPosition.phone_number}.`);

            } else {
                console.log(`Driver socket for phone number ${driverPosition.phone_number} not found.`);
            }

            // Clean up Redis entries
            if (clientPhoneNumber && driverPosition.phone_number) {
                // Delete client and driver match from Redis if both values exist
                await redisMatchClient.del(clientPhoneNumber);
                await redisMatchDriver.del(driverPosition.phone_number);
                console.log(`Redis entries deleted for client ${clientPhoneNumber} and driver ${driverPosition.phone_number}.`);
            }

        } catch (error) {
            console.error('Error handling cancel request:', error);
        }
    });
};

module.exports = {
    clientCancelInDemand
};
