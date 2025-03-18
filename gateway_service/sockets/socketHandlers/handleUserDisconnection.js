const handleUserDisconnection = (socket, sharedState) => {
    const { rideRequests, driverPositions, clients, drivers } = sharedState;
    const { phone_number, user_type } = socket.user;

    if (user_type === 'client') {
        // Remove the client's ride request if it exists
        const rideIndex = rideRequests.findIndex(ride => ride && ride.phone_number === phone_number);
        if (rideIndex !== -1) {
            rideRequests.splice(rideIndex, 1);
            console.log(`Removed ride request for client ${phone_number}`);
        }

        // Remove the client from the clients list
        delete clients[phone_number];
        console.log(`Client ${phone_number} disconnected`);
    } else if (user_type === 'driver') {
        // Remove the driver's position if it exists
        const driverIndex = driverPositions.findIndex(driver => driver && driver.phone_number === phone_number);
        if (driverIndex !== -1) {
            driverPositions.splice(driverIndex, 1);
            console.log(`Removed driver position for driver ${phone_number}`);
        }

        // Remove the driver from the drivers list
        delete drivers[phone_number];
        console.log(`Driver ${phone_number} disconnected`);
    }
};

module.exports = handleUserDisconnection;
