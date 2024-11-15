module.exports = validation

function validation(req, res, next) {
    console.log(req.body.username)
    if (!req.body.username) {
        res.status(401).send('Needs a username')
    }
    if (!req.body.password) {
        res.status(401).send('Needs a password')
    }
    next()
}