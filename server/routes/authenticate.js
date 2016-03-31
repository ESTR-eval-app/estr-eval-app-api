var hash = require('password-hash');
var db = require('../data/db.js');
var jwt = require('jsonwebtoken');
var secret = process.env.EVAL_N_TOKEN_KEY;

module.exports.post = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        res.status(400).json("error : must provide username and password");
    }
    else {
      db.table('accounts')
        .filter({
          "username": username
        })
        .limit(1)
        .then(function (result) {
          if (result.length == 1
            && passwordsMatch(result[0].password, req.body.password)) {
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

function passwordsMatch(found, provided) {
  return hash.verify(provided, found);
}

function userAuthSuccess(result, res) {
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