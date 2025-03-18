const axios = require('axios');

const cancel_Course_db = async (driver_phonenumber, client_phonenumber) => {
    const token = process.env.ADMIN_ACCESS_TOKEN.trim();
    console.log("this is the driver phone : ", driver_phonenumber)
    console.log("this is the client phone : ", client_phonenumber)

    try {
        await axios.put(`${process.env.DB_SERVER}/canceled/`,
            { clientPhone: client_phonenumber , driverPhone: driver_phonenumber }, 
            {
            headers: {
                authorization: token // Custom headers
            }
        });
    } catch (err) {
        console.error('Error sending course data:', err);
    }
}

module.exports = {
    cancel_Course_db
}