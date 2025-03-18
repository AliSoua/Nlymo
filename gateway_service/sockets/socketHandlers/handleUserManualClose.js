const handleUserManualClose = (socket) => {
    const { user_type, phone_number } = socket.user; // Assuming phone_number is stored in socket.user

    if (user_type === 'client') {
        delete clients[phone_number]; // Remove the client
    } else if (user_type === 'driver') {
        delete drivers[phone_number]; // Remove the driver
    }

    socket.disconnect(); // Manually trigger the disconnect
};

module.exports = handleUserManualClose;
