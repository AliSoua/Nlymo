const { redisMatchDriver } = require('../redis/redis');

const checkDriverRideExistance = async (phone_number) => {
    try {
        const result = await redisMatchDriver.exists(phone_number); // Check if the key (phone_number) exists in Redis

        if (result === 1) {
            console.log(`Ride exists for Driver with phone number ${phone_number}`);
            return true; // Ride exists
        } else {
            console.log(`No ride found for Driver with phone number ${phone_number}`);
            return false; // Ride does not exist
        }
    } catch (error) {
        console.error(`Error checking ride existence for Driver: ${error.message}`);
        return false;
    }
};

module.exports = {
    checkDriverRideExistance
};
