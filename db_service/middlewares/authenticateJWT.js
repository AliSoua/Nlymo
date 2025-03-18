const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticateJWT = (req, res, next) => {
  console.log("authenticateJWT.js db_service");
  const token = req.headers.authorization;
  console.log(token)
  const cleanToken = token.replace("Bearer ", "");

  if (!cleanToken) {
    return res.status(403).json({ error: 'denied' });
  }

  jwt.verify(cleanToken, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err.name)
      return res.status(403).json({ error: err });
    }
    req.user = user; // user contains phone_number
    next();
  });
};


module.exports = authenticateJWT;
