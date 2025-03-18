const axios = require('axios');

const createCourse = async (client, driver_phonenumber) => {
    const token = process.env.ADMIN_ACCESS_TOKEN.trim();
    const now = new Date(); // Define the current date/time
    console.log(client);

    const courseData = {
        driver_id: driver_phonenumber,
        client_id: client.phone_number,
        price: client.price, 
        destination: client.destination, 
        depart: client.depart, 
        time_of_starting_course: now.toISOString(), 
        time_of_end_course: now.toISOString(),
        state: "pending",
        dlatitude: client.dlatitude,
        dlongitude: client.dlongitude,
        alatitude: client.alatitude,
        alongitude: client.alongitude,
        distanceofcourse: client.distanceofcourse,
    };

    // store the course with live status on the course table
    try {
        await axios.post(`${process.env.DB_SERVER}/live/`, courseData, {
            headers: {
                authorization: token // Custom headers
            }
        });
    } catch (err) {
        console.error('Error sending course data:', err);
    }
}

module.exports = {
    createCourse
}