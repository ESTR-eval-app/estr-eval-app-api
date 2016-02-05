var db = require('../data/db.js');
var jwt = require('jsonwebtoken');
var secret = process.env.ESTR_API_TOKEN_KEY;

module.exports.post = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        res.status(400).json("error : must provide username and password");
    }
    else {
      db.table('accounts')
        .filter({
          "username": username,
          "password" : password
        })
        .limit(1)
        .run()
        .then(function (result) {
          console.log(result);
            if (result.length == 1) {
              userAuthSuccess(username, res);
            }
            else {
              userAuthFailure(res);
            }
        })
        .error(function (err) {
          console.log(err);
          es.status(500).json({"error": "an error occurred getting the record"});
        })
    }
};

function userAuthSuccess(username, res) {
  // create token
  var token = jwt.sign(username, secret, {
    expiresInMinutes: 1440 // 24 hours
  });

  // return the information including token as JSON
  res.json({
    success: true,
    message: 'auth success',
    token: token
  });

}

function userAuthFailure(res) {
  res.status(403).json("error : not authorized");
}