const db = require("../../data/dbConfig")
const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {

  try {
    const [activeSession] = await db("sessions").select("sess")
    const currentTime = new Date().toISOString();
    const expired = req.session.cookie['_expires']
    const token = req.session.user
    const secret = '123'
    //const token = authHeader && authHeader.split(' ')[1]
    if (currentTime > expired.toISOString()) {
      return res.status(401).json({ message: 'token expired' });
    }
    console.log(token, expired.toISOString() < currentTime) //
    if (!token) {
      return res.status(401).json({ message: 'token required' });
    }

    // jwt.verify(token, secret, (err, next) => {
    //   if (err) return res.status(403).json({ message: 'token expired' })
    //   next()
    // })
    //Check at 1hr and 3mins
    next()
  } catch (error) {

    return res.status(401).json({ message: "token required" })
  }

  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
