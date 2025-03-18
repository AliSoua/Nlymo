const { redisBanSystem } = require('../redis/redis');

// No need for promisify anymore

const banDuration = 1 * 60; // Ban duration in seconds (e.g., 1 minute)

const isBanned = async (driverPhone, clientPhone) => {

    const banKey = `${driverPhone}-${clientPhone}`;
    const banInfo = await redisBanSystem.get(banKey); // Directly use redis method
    
    if (banInfo) {
        return true; // Currently banned
    }
    return false; // Not banned
};

const addBan = async (driverPhone, clientPhone) => {
    console.log(driverPhone, clientPhone)
    
    if (driverPhone === clientPhone){
        return;
    }

    const banKey = `${driverPhone}-${clientPhone}`;
    await redisBanSystem.set(banKey, 'banned', 'EX', banDuration); // Directly use redis method with expiration
};

module.exports = {
    isBanned,
    addBan,
};
