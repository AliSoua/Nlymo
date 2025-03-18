const geolib = require('geolib');
const { notifyMatch } = require('../notify/notifyMatch.js');
const { fetchAllDrivers, fetchAllClients } = require('../redis/fetchData.js');
const { removeClient, removeDriver } = require('../redis/removeData.js');
const { redisMatchClientDriver } = require('../redisMatch/redisMatch.js');
const { isBanned } = require('../Ban/banSystem.js');
require('dotenv').config();

const findMatches = async () => {
    try {
        const [drivers, clients] = await Promise.all([fetchAllDrivers(), fetchAllClients()]);
        console.log(clients);
        console.log(drivers);
        
        if (drivers.length === 0 || clients.length === 0) {
            console.log('No drivers or clients available for matching.');
            return;
        }

        for (const client of clients) {
            const clientCoords = {
                latitude: parseFloat(client.dlatitude),
                longitude: parseFloat(client.dlongitude),
            };
            
            for (const driver of drivers) {
                if (await isBanned(driver.phone_number, client.phone_number)){
                    console.log(`${driver.phone_number}`,"banned with ",`${client.phone_number}`);
                    continue;
                }
                const driverCoords = {
                    latitude: parseFloat(driver.latitude),
                    longitude: parseFloat(driver.longitude),
                };

                // Convert driver's range from kilometers to meters
                const driverRangeMeters = parseFloat(driver.range) * 1000;

                const distance = geolib.getDistance(clientCoords, driverCoords);

                if (distance <= driverRangeMeters) {
                    console.log(`Match found! Client: ${client.phone_number} -> Driver: ${driver.phone_number}, Distance: ${distance} meters`);
                    
                    // Immediately remove the client and driver to avoid re-matching
                    await Promise.all([removeDriver(driver), removeClient(client)]);
                    
                    // Redis operation to store match of both client and driver
                    redisMatchClientDriver(driver, client);
                    
                    await notifyMatch(client, driver);
                    
                    break;
                }
                
            }
        }

    } catch (error) {
        console.error('Error finding matches:', error);
    }
};

module.exports = {
    findMatches,
};
