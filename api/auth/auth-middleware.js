const db = require("../../data/dbConfig")
module.exports = validation

async function validation(req, res, next) {
    let user = req.body.username
    let username = await db("users").select("username").where("username", user).first()
    console.log(username)

    if (!req.body.username || !req.body.password) {
        return res.status(401).send("username and password required")
    }

    if (username) {
        return res.status(401).send("username taken")
    }
    next()
}
