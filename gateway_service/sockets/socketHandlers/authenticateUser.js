const jwt = require('jsonwebtoken');
const fetchUserDetails = require('../userAuth'); // Adjust path if needed
require('dotenv').config(); // Load environment variables

const authenticateUser = (socket, next) => {
    const token = socket.handshake.headers.authorization; 
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET; 

    if (!accessTokenSecret) {
        console.log("Access token secret not defined");
        return next(new Error('Server error: Token secret missing'));
    }

    if (!token) {
        console.log("no token");
        return next(new Error('Authentication error'));
    }

    

    jwt.verify(token, accessTokenSecret, (err, decodedToken) => {
        if (err) {
            console.log(err);
            return next(new Error('Authentication error'));
        }

        const { phone_number } = decodedToken; // Extract phone_number from decoded token
        console.log(decodedToken);
        console.log(phone_number);

        // Call the function to fetch user details
        fetchUserDetails(phone_number, token, socket, next);
    });
};

module.exports = authenticateUser;
