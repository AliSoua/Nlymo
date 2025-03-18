const { redisBanSystem } = require('../redis/redisClient');

// Ban duration in seconds (e.g., 1 minute)
const banDuration = 1 * 60; 

// Function to check if a driver has banned a client
const isBanned = async (driverPhone, clientPhone) => {
    const banKey = `${driverPhone}-${clientPhone}`;

    try {
        const banInfo = await redisBanSystem.get(banKey); // Check Redis if ban exists
        return !!banInfo; // If banInfo exists, return true, else false
    } catch (error) {
        console.error(`Error checking ban for ${driverPhone} and ${clientPhone}:`, error);
        throw new Error('Could not check ban status'); // Handle errors gracefully
    }
};

// Function to add a ban with an expiration
const addBan = async (driverPhone, clientPhone) => {

    if (driverPhone === clientPhone){
        return;
    }
    const banKey = `${driverPhone}-${clientPhone}`;
    try {
        await redisBanSystem.set(banKey, 'banned', 'EX', banDuration); // Set ban in Redis with expiration
        console.log(`Ban added for ${driverPhone} -> ${clientPhone} for ${banDuration} seconds`);
    } catch (error) {
        console.error(`Error adding ban for ${driverPhone} and ${clientPhone}:`, error);
        throw new Error('Could not add ban');
    }
};

module.exports = {
    isBanned,
    addBan,
};
