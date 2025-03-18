const { redisMatchClient, redisMatchDriver } = require('../redis/redisClient');

const redisMatchClientDriver = async (driver, client) => {
    try {
        // Add each field of the driver object into Redis using driver's phone number as the key
        await redisMatchDriver.hset(driver.phone_number, {
            phone_number: client.phone_number,
            destination: client.adressedestination,
            depart: client.adressedepart,
            dlatitude: client.dlatitude,
            dlongitude: client.dlongitude,
            alatitude: client.alatitude,
            alongitude: client.alongitude,
            distanceofcourse: client.distanceofcourse,
            status: 'pending',
            price: client.price,
        });
        console.log(`Client ${client.phone_number} matched with Driver ${driver.phone_number}`);

        // Add each field of the client object into Redis using client's phone number as the key
        await redisMatchClient.hset(client.phone_number, {
            phone_number: driver.phone_number,
            latitude: driver.latitude,
            longitude: driver.longitude,
            range: driver.range,
            status: 'pending'
        });
        console.log(`Driver ${driver.phone_number} matched with Client ${client.phone_number}`);

    } catch (error) {
        console.error(`Error matching client to driver: ${error.message}`);
    }
};

module.exports = {
    redisMatchClientDriver
};
