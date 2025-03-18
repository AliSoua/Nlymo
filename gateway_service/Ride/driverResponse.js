const SocketManager = require('../sockets/socketClass'); // Adjust the path as necessary
const { redisMatchDriver, redisMatchClient, redisClientSocket, redisRideRequest } = require('../redis/redis');
const { createCourse } = require('./createCourse/createCourse');
const { cancel_Course_db } = require('./cancelRide/cancelCourse_db');
const Joi = require('joi'); // A popular validation library




const driverResponse = async (socket) => {
    const io = SocketManager.getInstance(); // Get the socket.io instance

    socket.on('driver_response', async (data) => {
        try {
            if (data.driver_response === "driver_accept") {
                console.log("driver_accept socket is being called");
                console.log("this is the data :",data);

                // Retrieve clientNumber using driver's phone number
                const clientNumber = await redisMatchDriver.hgetall(data.driver_phonenumber);
                const clientdata = await redisMatchClient.hgetall(clientNumber.phone_number);
                console.log("this is client data :", clientdata);
                const updated_data = {
                    state_ride: 'started',
                    ...clientdata,
                    ...data,
                }
                console.log("this is updated data :" ,updated_data);
                await redisMatchClient.hset(clientNumber.phone_number, updated_data);
                
                console.log("this is the clientnumber: ",clientNumber);
                if (clientNumber && clientNumber.phone_number) {
                    const clientSocket = await redisClientSocket.hgetall(clientNumber.phone_number);
                    console.log(clientSocket.socketId);

                    if (clientSocket && clientSocket.socketId) {
                        io.to(clientSocket.socketId).emit("driver_infos", data);
                        console.log("Driver info emitted to client:", data);
                    } else {
                        console.log(`Client socket for phone number ${clientNumber.phone_number} not found.`);
                    }
                } else {
                    console.log(`No client number found for driver ${data.driver_phonenumber}.`);
                }

                // Create a course with pending state
                createCourse(clientNumber, data.driver_phonenumber);
            }

            if (data.driver_response === "driver_cancel") {
                console.log(data);
                console.log("Driver_cancel socket is getting called", socket.user.phone_number);

                const driverPhoneNumber = socket.user.phone_number;

                // Retrieve clientRide using driver's phone number
                const clientRide = await redisMatchDriver.hgetall(driverPhoneNumber);
                console.log(clientRide);
                try {
                    await redisMatchClient.del(socket.user.phone_number);
                    console.log(`Successfully deleted client ${socket.user.phone_number}`);
                } catch (error) {
                    console.error(`Error deleting client ${socket.user.phone_number}:`, error);
                }
                
                try {
                    await redisMatchDriver.del(clientRide.phone_number);
                    console.log(`Successfully deleted driver ${clientRide.phone_number}`);
                } catch (error) {
                    console.error(`Error deleting driver ${clientRide.phone_number}:`, error);
                }
                

                if (clientRide && clientRide.phone_number) {
                    const clientSocket = await redisClientSocket.hgetall(clientRide.phone_number);



                    //try {
                        // Cancel the course in the database
                      //  await cancel_Course_db(clientRide.phone_number, driverPhoneNumber);
                    //} catch (error) {
                    //    console.log("Error while canceling course:", error);
                    //}

                    // Emit ride info to the client after deletion
                    if (clientSocket && clientSocket.socketId) {
                        io.to(clientSocket.socketId).emit('ride_infos', clientRide);
                        console.log(`Emitted ride info to client in driver_response ${clientRide.phone_number}:`, clientRide);
                    } else {
                        console.log(`Client socket for phone number ${clientRide.phone_number} not found.`);
                    }
                    


                } else {
                    console.log(`No ride found for driver ${driverPhoneNumber}.`);
                }    
            }
        } catch (error) {
            console.error('Error in driver_response:', error);
        }
    });
};

module.exports = {
    driverResponse
};
