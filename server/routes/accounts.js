// TODO hash passwords
var db = require('../data/db.js');

// get accounts
module.exports.get = function (req, res) {

  // check whether requesting user has permissions
  console.log(req.decodedToken.username + " is admin? " + req.decodedToken.isAdmin);
  if (!req.decodedToken.isAdmin) {
    res.status(403).json({"message": "not authorized"});
  }
  else if (!req.params.username) {
    // get all
    db.table('accounts')
      .run()
      .then(function (result) {
        if (result.length == 0) {
          res.status(404).json({error: "no accounts found"});
        }
        else {
          res.json({
            "id": result.id,
            "username": result.username,
            "isAdmin": result.isAdmin
          });
        }
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({"error": "an error occurred getting the record"});
      })
  }
  else {
    // get one by id
    db.table('accounts')
      .filter({
        "username": req.params.username
      })
      .limit(1)
      .run()
      .then(function (result) {
        if (result.length == 0) {
          res.status(404).json({error: "account not found"});
        }
        else {
          res.json({
            "id": result.id,
            "username": result.username,
            "isAdmin": result.isAdmin
          });
        }
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({"error": "an error occurred getting the record"});
      })
  }
};


// create account
module.exports.post = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var isAdmin = req.body.isAdmin;

  // check whether requesting user has permissions
  console.log(req.decodedToken.username + " is admin? " + req.decodedToken.isAdmin);
  if (!req.decodedToken.isAdmin) {
    res.status(403).json({"message": "not authorized"});
  }

  if (!username) {
    res.json({error: "must provide username"});
  }
  if (!password) {
    res.json({error: "must provide password"});
  }

  // check for existing user with same name, otherwise add
  db.table('accounts')
    .filter({
      "username": username
    })
    .limit(1)
    .run()
    .then(function (result) {
      if (result.length == 0) {
        createAccount(username, password, isAdmin, res);
      }
      else {
        res.status(400).json("this user cannot be added");
      }
    });

  function createAccount(username, password, isAdmin, res) {
    db.table('accounts')
      .insert(
        {
          "username": username,
          "password": password,
          "isAdmin": isAdmin
        })
      .run()
      .then(function (result) {
        res.json({
          "username": username
        });
      })
      .error(function (err) {
        res.json({error: err});
      })
  }

};

// update a user by username
module.exports.put = function (req, res) {
  if (!req.params.username) {
    res.status(400).json({"error": "must provide username"});
  }
  // can only be updated by admin or self
  else if (req.decodedToken.username != req.params.username || !req.decodedToken.isAdmin) {
    res.status(403).json({"message": "not authorized"});
  }
  else {
    db.table('accounts')
      .filter({
        "username": req.params.username
      })
      .update({
        "username": req.body.username,
        "password": req.body.password,
        "isAdmin": req.body.isAdmin
      })
      .then(function (result) {
        if (result.replaced == 1 || result.unchanged == 1) {
          res.json({"username": req.body.username});
        }
        else {
          res.status(404).json({error: "account not found"});
        }
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({"error": "an error occurred updating the record"});
      })
  }
};

// delete a user by username
module.exports.delete = function (req, res) {
  if (!req.params.username) {
    res.status(400).json({"error": "must provide username"});
  }
  else {

    console.log(req.decodedToken.username + " is admin? " + req.decodedToken.isAdmin);
    if (!req.decodedToken.isAdmin) {
      res.status(403).json({"message": "not authorized"});
    }
    else {
      db.table('accounts')
        .filter({
          "username": req.params.username
        })
        .delete()
        .then(function (result) {
          if (result.deleted != 1) {
            res.status(404).json({error: "username not found"});
          }
          else {
            res.json({"deleted": req.params.username});
          }
        })
        .error(function (err) {
          console.log(err);
          res.status(500).json({"error": "an error occurred deleting the record"});
        })
    }
  }
};

