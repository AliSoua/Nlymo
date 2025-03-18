const { redisMatchClient, redisRideRequest, redisMatchDriver } = require("../redis/redis");


const handleClientReconnection = async (socket) => {
    const { phone_number, user_type, } = socket.user;

    console.log(`New connection: Socket ID ${socket.id}, Phone Number: ${phone_number}, User Type: ${user_type}`);

    // Store only the socket ID and user type in Redis
    const data = await redisMatchClient.hgetall(phone_number);

    console.log(data);

    const sent_data = {
        driver_phonenumber: data.driver_phonenumber,
        driver_carmodel: data.driver_carmodel,
        driver_name: data.driver_name,
        returnstate: data.statevalue
    }
    console.log("sent_data", sent_data);
    if (data && data.phone_number){
        console.log("this client has a ride already so he must get reconnected !");
        socket.emit('return_todriverontheway', sent_data);
    }
    else{
        console.log("this client has no rides.");
    }

};

module.exports = {
    handleClientReconnection,
};
