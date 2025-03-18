const { redisMatchClient, redisMatchDriver, redisDriverSocket, redisClientSocket } = require('../../redis/redis');
const socketClass = require('../../sockets/socketClass');
const axios = require('axios')


const ridePosition = async (socket) => {
  io = socketClass.getInstance()  

  socket.on('driver_positionupdate', async (localisation) => {
    console.log(localisation);


    // Fetch all necessary data concurrently
    const [driverSocket, clientRide, ] = await Promise.all([
      redisDriverSocket.hgetall(socket.user.phone_number),
      redisMatchDriver.hgetall(socket.user.phone_number),
      
    ]);

    const driverRidetest = await redisMatchClient.hgetall(clientRide.phone_number)

    if (localisation.statevalue === "depart_position"){

        console.log("console of depart postion : ", clientRide);
        console.log("console of depart postion : ", driverRidetest);
            // Update the client's status in Redis
            const updatedData = {
              ...clientRide,
              statevalue: 'depart_position',
          };

          await redisMatchClient.hset(clientRide.phone_number, updatedData);
          console.log(`Updated client ${clientRide.phone_number} to drive_ended state.`);
    }

    if (localisation.statevalue === "on_theway_todestination"){

      console.log("console of depart postion : ", clientRide);
      console.log("console of depart postion : ", driverRidetest);
          // Update the client's status in Redis
          const updatedData = {
            ...clientRide,
            statevalue: 'on_theway_todestination',
        };

        await redisMatchClient.hset(clientRide.phone_number, updatedData);
        console.log(`Updated client ${clientRide.phone_number} to drive_ended state.`);
  }




    const clientSocket = await redisClientSocket.hgetall(clientRide.phone_number)
    if (localisation.statevalue === "destination_position"){
      
      console.log(clientSocket.socketId)

      io.to(driverSocket.socketId).emit('driver_position_received', localisation);
      io.to(clientSocket.socketId).emit('driver_position_received', localisation);

      // update the course to finished
      try {      
        
        await axios.put(`${process.env.DB_SERVER}/finished/`, 
        { clientPhone:clientRide.phone_number , driverPhone: socket.user.phone_number },
        {
            headers: {
                'authorization': socket.handshake.headers.authorization// Custom headers
            }
      })

      } catch(err) {
        console.log(err)
      }


      await redisMatchClient.del(clientRide.phone_number)
      await redisMatchDriver.del(socket.user.phone_number)

      return
    }

    io.to(driverSocket.socketId).emit('driver_position_received', localisation);
    io.to(clientSocket.socketId).emit('driver_position_received', localisation);
  });

}

module.exports = {
  ridePosition
}