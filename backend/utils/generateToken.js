const jwt = require('jsonwebtoken');

// Generate a JWT token for a user ID
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload — what we encode inside the token
    process.env.JWT_SECRET, // Secret key from .env
    { expiresIn: '7d' } // Token valid for 7 days
  );
};

module.exports = generateToken;