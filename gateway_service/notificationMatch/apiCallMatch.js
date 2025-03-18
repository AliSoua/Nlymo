const { redisClientSocket } = require('../redis/redis');
const SocketManager = require('../sockets/socketClass'); // Adjust the path as necessary
const { storeCourse } = require('./storeCourse');


const apiCallMatch = async (DriverSocketId, clientData) => {
    const io = SocketManager.getInstance(); // Get the socket.io instance
    console.log(`Driver Socket ID: ${DriverSocketId}`);

    // Check if the driver socket ID is valid
    const driverSocket = io.sockets.sockets.get(DriverSocketId);

    if (driverSocket) {
        // Emit the ride confirmation event
        await driverSocket.emit('ride_confirmation', {
            message: 'client found',
            client_phone: clientData.phone_number,
            client_latitude: clientData.dlatitude,
            client_longitude: clientData.dlongitude,
        });

        // Emit the ride details event to the driver
        await driverSocket.emit('ride_infosdriver', clientData);


        //storeCourse(clientData, driverSocket.user.phone_number)
        
        console.log(`Ride information sent to driver with socket ID ${DriverSocketId}`);

    } else {
        console.log('Driver socket ID not found.');
    }
};

module.exports = {
    apiCallMatch
};
