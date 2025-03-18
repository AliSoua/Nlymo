const axios = require('axios')

const storeCourse = async (ride, driver_phone_number) => {
    try {
        // Get the current date and time, and adjust to UTC+2
        const now = new Date();
        now.setHours(now.getHours() + 2); // Adjust to UTC+2
          // Create a combined object for the live course with the starting time
          liveCourse = {
            driver_phone: driver_phone_number,
            client_phone: ride.phone_number,
            depart: ride.adressedepart,
            destination: ride.adressedestination,
            price: ride.price,
            starting_time: now.toISOString(), // Capture the current time
            state: "pending",
            dlatitude: ride.dlatitude,
            dlongitude: ride.dlongitude,
            alatitude: ride.alatitude,
            alongitude: ride.alongitude,
            distanceofcourse: ride.distanceofcourse,
          };
          console.log(liveCourse)
        // Send an api call to the db_microservice
        const response = await axios.post('http://localhost:3636/db/course/live', {
            courseData,
            message: 'Storing New Course'
        });

        console.log(`Storing starting course Done: ${response.data}`);
    } catch (error) {
        console.error('Error Storing starting course:', error.response ? error.response.data : error.message);
    }
};

module.exports = {
    storeCourse
}