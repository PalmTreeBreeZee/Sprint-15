const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');
const session = require("express-session")
const { ConnectSessionKnexStore } = require("connect-session-knex"); //why is this giving me an error: It needed to be deconstructed
const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session({
    name: "Goku",
    secret: "Keeponthelow",
    cookie: {
        maxAge: 5000, //milliseconds
        secure: false, //Set to true on live server
        httpOnly: false, //Set to true means that JS cannot hit it
    },
    rolling: true, //Fresh cookie on every login
    resave: false,
    saveUninitialized: false, //This means we cannot set cookies on any client that makes a request
    store: new ConnectSessionKnexStore({
        knex: require('../data/dbConfig.js'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 5000 //milliseconds
    })
}))

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

module.exports = server;
