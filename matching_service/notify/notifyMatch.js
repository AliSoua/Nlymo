const axios = require('axios');

const notifyMatch = async (clientData, driverData) => {
    try {
        // Send a notification to the driver service
        const response = await axios.post('http://localhost:3003/api/notify', {
            driverPhone: driverData.phone_number,
            clientData,  // Simplified data structure
            message: 'You have a new ride request!'
        });

        // Log response as a formatted string
        console.log(`Notification sent: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
        // Enhanced error logging with more details
        console.error('Error notifying driver or client:', error.response ? {
            status: error.response.status,
            data: error.response.data
        } : error.message);
    }
};

module.exports = {
    notifyMatch
};
