var db = require('../data/db.js');

// get evaluations
module.exports.get = function (req, res) {
  if (!req.params.id) {
    // get all
    db.table('evaluations')
      // todo change from all to all for user
      .run()
      .then(function (result) {
        if (result.length == 0) {
          res.status(404).json({error: "no evaluations found"});
        }
        else {
          res.json(result);
        }
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({"error": "an error occurred getting the record"});
      })
  }
  else {
    // get one by id
    db.table('evaluations')
      .filter({
        "id": req.params.id
        // todo filter for user
      })
      .limit(1)
      .run()
      .then(function (result) {
        if (result.length == 0) {
          res.status(404).json({error: "evaluation not found"});
        }
        else {
          res.json(result);
        }
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({"error": "an error occurred getting the record"});
      })
  }
};