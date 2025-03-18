const { redisRideRequest } = require('../redis/redis');
const { checkClientRideExistance } = require('../Ride/checkClientRideExistance');

const clientRideRequest = async (socket) => {
    socket.on('ride_infos', async (ride) => {
        // Check if the ride object exists
        if (!ride) {
            console.log('No ride information provided');
            return;
        }

        console.log(ride);
        // Check if the client is already in a ride (awaiting the result of async function)
        const rideExists = await checkClientRideExistance(ride.phone_number);
        if (rideExists) {
            console.log("Ride already exists for this client.");
            return;
        }

        const { 
            phone_number, 
            price, 
            adressedestination, 
            adressedepart, 
            dlatitude, 
            dlongitude, 
            alatitude, 
            alongitude, 
            distanceofcourse 
        } = ride;

        // Store each ride property in Redis with the phone number as the key
        await redisRideRequest.hset(phone_number, {
            phone_number,
            price,
            adressedestination,
            adressedepart,
            dlatitude,
            dlongitude,
            alatitude,
            alongitude,
            distanceofcourse
        });

        // Optionally, you can fetch the updated ride request from Redis to confirm
        const riderequests = await redisRideRequest.hgetall(phone_number);
        console.log('Updated Ride Requests: ', riderequests);
    });
};

module.exports = {
    clientRideRequest
};
