const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticateJWT = (req, res, next) => {
  console.log("authenticateJWT.js auth service");
  const token = req.headers.authorization;
  console.log(token)
  if (!token) {
    return res.status(403).json({ error: 'denied' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'denied' });
    }
    req.user = user; // user contains phone_number
    next();
  });
};


module.exports = authenticateJWT;
