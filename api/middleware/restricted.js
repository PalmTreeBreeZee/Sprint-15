const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode')

module.exports = (req, res, next) => {
  // Extract token from Authorization header (format: Bearer <token>)

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token part
  const decoded = jwt_decode.jwtDecode(token)
  console.log(decoded)
  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  try {
    const secret = '123'; // Use the correct secret for verification
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.status(403).json({ message: 'invalid token' })
      req.user = decoded;
      next()
    }) // Verify the token

    // Attach the decoded payload to the request for use in subsequent middleware


    // Call next middleware
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

/*
  IMPLEMENT

  1- On valid token in the Authorization header, call next.

  2- On missing token in the Authorization header,
    the response body should include a string exactly as follows: "token required".

  3- On invalid or expired token in the Authorization header,
    the response body should include a string exactly as follows: "token invalid".
*/

