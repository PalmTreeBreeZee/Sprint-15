const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  // Extract token from Authorization header (format: Bearer <token>)

  const authHeader = req.headers.authorization;
  // Extract the token part

  console.log(authHeader)
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  let token = authHeader.split(' ')[1];
  token = token.split('"').join('');
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  try {

    const secret = '123'; // Use the correct secret for verification
    jwt.verify(token, secret, (err, user) => {

      if (err) return res.status(403).json({ message: 'invalid token' })

      req.user = user;
      next()
    }) // Verify the token

    // Attach the decoded payload to the request for use in subsequent middleware


    // Call next middleware

  } catch (err) {
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(501).json({ message: 'Internal server error' });
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

