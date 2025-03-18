const authenticateUser = require('./socketHandlers/authenticateUser');
const { logConnectedSockets } = require('./socketHandlers/logConnectedSockets');
const { handleClientConnection } = require('../Client/clientConnection');
const { handleDriverConnection } = require('../Driver/driverConnection');
const { checkExistanceClient } = require('../utils/checkExistanceClient');
const { checkExistanceDriver } = require('../utils/CheckExistanceDriver');
const { disconnectClient } = require('../Client/disconnectClient');
const { disconnectDriver } = require('../Driver/disconnectDriver');
const { sendDriverPosition } = require('../Driver/positionDriver');
const { clientRideRequest } = require('../Client/clientRideRequest');
const { clientCancelInDemand } = require('../Client/clientCancelInDemand');
const { driverResponse } = require('../Ride/driverResponse');
const { DriverCancelRide } = require('../Ride/cancelRide/driverCancelRide');
const { clientCancelRide } = require('../Ride/cancelRide/clientCancelRide');
const SocketManager = require('./socketClass'); // Import SocketManager
const { ridePosition } = require('../Ride/ridePosition/ridePosition');
const { stateConnection } = require('../Driver/stateConnection');

const initSocket = (server) => {
    const io = SocketManager.init(server); // Initialize Socket.IO

    io.use(authenticateUser); // Use the authentication middleware
    
    io.on('connection', async (socket) => {

        if (socket.user.user_type === "client") {
            checkExistanceClient(socket);
            handleClientConnection(socket);
            clientRideRequest(socket);
            disconnectClient(socket);
            clientCancelInDemand(socket);
            clientCancelRide(socket);
        } 
        else {
            checkExistanceDriver(socket);
            handleDriverConnection(socket);
            sendDriverPosition(socket);
            disconnectDriver(socket);
            //driver response for ride demand
            driverResponse(socket);
            DriverCancelRide(socket);
            ridePosition(socket);
            stateConnection(socket);
        }

    });

    // Periodic logging of all socket IDs
    setInterval(() => logConnectedSockets(io), 60000); // Log every 15 seconds

    // Call the function to log all connected sockets on startup
    logConnectedSockets(io);
};

module.exports = {
    initSocket,
};
