//TODO hash passwords
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
            if (result.length == 1) {
              userAuthSuccess(result[0], res);
            }
            else {
              userAuthFailure(res);
            }
        })
        .error(function (err) {
          console.log(err);
          res.status(500).json({"error": "an error occurred getting the record"});
        })
    }
};

function userAuthSuccess(result, res) {
  3.
  console.log('AUTH success ' + result.username);
  var user = {
    id : result.id,
    username : result.username,
    isAdmin : result.isAdmin
  };
  // create token
  var token = jwt.sign(user, secret,
    {
      expiresIn: 43200 // seconds = 12 hours
    });

  res.json({
    token: token
  });

}

function userAuthFailure(res) {
  res.status(403).json("error : not authorized");
}