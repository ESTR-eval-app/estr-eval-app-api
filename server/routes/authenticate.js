var jwt = require('jsonwebtoken');

module.exports.post = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
console.log(username)
    console.log(password)
    if (!username || !password) {
        res.status(400).json("error : must provide username and password");
    }
    else {
        // TODO check against db
        if (username == 'steve' && password == 'test') {
            // success

            // create token
            var token = jwt.sign(username, 'secret', {
                expiresInMinutes: 1440 // 24 hours
            });

            // return the information including token as JSON
            res.json({
                success: true,
                message: 'auth success',
                token: token
            });
        }

        res.status(403).json("error : not authorized");
    }
}