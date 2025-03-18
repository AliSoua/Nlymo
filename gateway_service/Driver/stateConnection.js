const { redisDriverPosition } = require('../redis/redis');

const stateConnection = async (socket) => {
    socket.on('state_connection_driver', async (data) => {
        if (data.state_connection === 'disconnected') {
            await redisDriverPosition.del(socket.user.phone_number)
            console.log("went offline : delete driverpostion")
        }

    });
}

module.exports = {
    stateConnection
}