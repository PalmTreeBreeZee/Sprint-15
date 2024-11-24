const db = require("../../data/dbConfig")
module.exports = async (req, res, next) => {

  try {
    const [activeSession] = await db("sessions").select("sess")
    const currentTime = Date.now();
    const [expired] = await db("sessions").select("expired")


    console.log(activeSession, expired, req.session.cookie._expires) //
    if (!expired && req.session.cookie._expires) {
      return res.status(401).json({ message: 'token expired' });
    }

    //Check at 1hr and 3mins
    next()
  } catch (error) {
    res.status(401).json({ message: "token required" })
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
