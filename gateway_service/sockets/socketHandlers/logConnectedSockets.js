const logConnectedSockets = (io) => {
    console.log('All connected sockets:');
    io.fetchSockets().then((sockets) => {
        sockets.forEach((socket) => {
            console.log(`Socket ID: ${socket.id}, Phone Number: ${socket.user?.phone_number || 'N/A'}, User Type: ${socket.user?.user_type || 'N/A'}`);
        });
    }).catch((err) => {
        console.error('Error fetching sockets:', err);
    });
};

const checkExistingSockets = (io, phone_number) => {
    return io.fetchSockets().then((sockets) => {
        const existingSockets = sockets.filter((socket) => socket.user?.phone_number === phone_number);
        
        if (existingSockets.length > 0) {
            console.log(`Socket(s) exist for phone number: ${phone_number}`);
            existingSockets.forEach((socket) => {
                console.log(`Found Socket ID: ${socket.id}`);
            });
            return true; // Indicate that existing sockets were found
        } else {
            console.log(`No existing sockets found for phone number: ${phone_number}`);
            return false; // Indicate that no existing sockets were found
        }
    }).catch((err) => {
        console.error('Error checking existing sockets:', err);
        return false; // In case of error, return false
    });
};

module.exports = {
    logConnectedSockets,
    checkExistingSockets,
};
