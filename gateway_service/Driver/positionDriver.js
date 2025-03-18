const { redisDriverPosition } = require('../redis/redis');
const { checkDriverRideExistance } = require('../Ride/checkDriverRideExistance');

const sendDriverPosition = async (socket) => {
    socket.on('driver_position', async (localisation) => {
        console.log(socket.id);

        // Check if localisation object exists
        if (!localisation || !localisation.phone_number || !localisation.latitude || !localisation.longitude) {
            console.log('Invalid localisation data');
            return;
        }


        const { latitude, longitude, range, phone_number } = localisation;

        // Check if the driver's position already exists in Redis
        const existingDriverPosition = await redisDriverPosition.exists(phone_number);
        if (existingDriverPosition) {
            // If the key already exists, update it and return
            await redisDriverPosition.hset(phone_number, {
                phone_number,
                latitude,
                longitude,
                range,
            });
            console.log(`Driver position updated for phone number ${phone_number}`);
            return;
        }

        // Check if the driver is already in a ride (awaiting the result of async function)
        const isDriverInRide = await checkDriverRideExistance(phone_number);
        if (isDriverInRide) {
            console.log("This driver is already in a ride");
            return;
        }

        // Store the driver's position in Redis using their phone number as the key
        await redisDriverPosition.hset(phone_number, {
            phone_number,
            latitude,
            longitude,
            range,
        });

        // Optionally, fetch the updated position from Redis to confirm
        const updatedPosition = await redisDriverPosition.hgetall(phone_number);
        console.log('Updated Driver Position: ', updatedPosition);
    });
};

module.exports = {
    sendDriverPosition
};
