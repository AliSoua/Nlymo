const { redisMatchClient } = require('../redis/redis');

const checkClientRideExistance = async (phone_number) => {
    try {
        const result = await redisMatchClient.exists(phone_number); // Check if the key (phone_number) exists in Redis

        if (result === 1) {
            console.log(`Ride exists for client with phone number ${phone_number}`);
            return true; // Ride exists
        } else {
            console.log(`No ride found for client with phone number ${phone_number}`);
            return false; // Ride does not exist
        }
    } catch (error) {
        console.error(`Error checking ride existence for client: ${error.message}`);
        return false;
    }
};

module.exports = {
    checkClientRideExistance
};
