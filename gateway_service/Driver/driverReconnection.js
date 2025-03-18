const { redisMatchDriver } = require("../redis/redis");


const handleDriverReconnection = async (socket) => {
    const { phone_number, user_type, } = socket.user;

    console.log(`New connection: Socket ID ${socket.id}, Phone Number: ${phone_number}, User Type: ${user_type}`);

    // Store only the socket ID and user type in Redis
    const data = await redisMatchDriver.hgetall(phone_number);
    console.log(data);

    const newData = {
        adressedepart: data.depart,
        adressedestination: data.destination,
        price: data.price
    }

    if (data && data.phone_number){
        console.log("this driver has a ride already so he must get reconnected !");
        socket.emit('return_toride', newData);
    }
    else{
        console.log("this driver has no rides.");
    }

};

module.exports = {
    handleDriverReconnection,
};
