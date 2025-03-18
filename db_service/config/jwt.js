const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

function generateAccessToken(phone_number) {
  return jwt.sign({ phone_number }, ACCESS_TOKEN_SECRET, { expiresIn: '29d' });
}

function generateRefreshToken(phone_number, pool) {
  const refreshToken = jwt.sign({ phone_number }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
  pool.query('INSERT INTO tokens (token) VALUES ($1)', [refreshToken], (err) => {
    if (err) {
      console.error('Error storing refresh token:', err.message);
    }
  });
  return refreshToken;
}

module.exports = {
  generateAccessToken,
  generateRefreshToken
};
