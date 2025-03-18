const axios = require('axios'); // Import axios for API calls

// Function to fetch user details and authenticate the socket
const fetchUserDetails = async (phone_number, token, socket, next) => {
    try {
        // Sending a GET request to /user/info with the phone number as a query parameter and JWT token in the header
        const response = await axios.get(
            'http://localhost:3000/user/info', // API endpoint
            {
                headers: {
                    authorization: `${token}`, // Adding the JWT token to the Authorization header
                },
                params: {
                    phone_number: phone_number, // Pass phone_number as a query parameter
                }
            }
        );
        
        const user = response.data; // Get user data from the response

        if (user.is_blocked === true) { // Check if the user is blocked
            console.log(`User ${phone_number} is blocked. Disconnecting...`);
            socket.emit('blocked', { message: 'You are blocked from using the service.' });
            return socket.disconnect(); // Disconnect blocked users immediately
        }

        // Attach user details to socket object for later use
        if (user.user_type === 'client'){
            socket.user = {
                id: user.id,
                phone_number: user.phone_number,
                user_type: user.user_type,
                first_name: user.first_name,
                last_name: user.last_name,
                postpone: false,
            };
        }
        else{
            socket.user = user;
        }

        console.log("User authenticated");
        next(); // Proceed to the next middleware
    } catch (err) {
        console.error('Error fetching user data:', err.message); // Handle errors appropriately
        return err.message; // Forward error to the middleware
    }
};

module.exports = fetchUserDetails; // Export the function
