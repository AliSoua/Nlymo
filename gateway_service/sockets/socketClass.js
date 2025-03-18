const socketIo = require('socket.io');

class SocketManager {
    constructor() {
        this.io = null; // Initialize io as null
    }

    init(server) {
        if (!this.io) { // Only initialize if it's not already initialized
            this.io = socketIo(server);
        }
        return this.io; // Return the io instance
    }

    getInstance() {
        if (!this.io) {
            throw new Error('Socket.IO not initialized. Call init(server) first.');
        }
        return this.io;
    }
}

module.exports = new SocketManager();
