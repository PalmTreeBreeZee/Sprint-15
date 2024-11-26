const router = require('express').Router();
const bcrypt = require('bcryptjs')
const db = require('../../data/dbConfig')
const validation = require("./auth-middleware")
const jwt = require("jsonwebtoken") //Readup on jwt

router.post('/register', validation, async (req, res) => {

  try {

    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 6)
    const newUser = { username, password: hash }
    await db('users').insert(newUser)

    const lastUser = await db('users')
      .select('id', 'username', 'password')
      .orderBy('id', 'desc')
      .first()


    res.status(201).json(lastUser)
  }
  catch (err) {
    res.status(400).send(err)
  }

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,m
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(401).json({
        message: "username and password required"
      })
    }
    const user = await db("users").select().where("username", username).first()


    if (user && bcrypt.compareSync(password, user.password)) {
      const v = '123'
      const token = jwt.sign(user, v)

      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: "Session error" });
        }
        // Set user data in the new session
        req.session.user = user;
        // Save the session to update the expire date
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: "Session save error" });
          }

          res.json({
            message: `welcome, ${username}`,
            token //start at 57mins
          })
        });
      });
    } else {
      return res.status(401).json({
        message: "invalid credentials"
      })
    }
  } catch (err) {
    return res.status(401).json({
      message: "invalid credentials"
    })
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- }On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
