var db = require('../data/db.js');



// TODO protect updates and deletion so only possible by user that owns the evaluation
// TODO prevent updates to evaluations unless status is Created

// create evaluation
module.exports.post = function (req, res) {
  if (!requestBodyValid(req)) {
    res.status(400).json({
      "error" : "must provide name, user id, avail date and questions"
    });
  } else {
    db.table('evaluations')
      .insert(
        {
          "name": req.body.name,
          "createdBy": req.body.createdBy,
          "resultsAvailableDate": req.body.resultsAvailableDate,
          "isAnonymous": req.body.isAnonymous,
          "status": "Created",
          "questions": req.body.questions
        }
      )
      .run()
      .then(function (result) {
        res.json({"id": result.generated_keys[0]});
      })
      .error(function (err) {
        res.status(500).json({
          "error": "an error occurred inserting the record"
        });
      })
  }
};

// update evaluation by id
module.exports.put = function (req, res) {
  if (!req.params.id) {
    res.status(400).json({
      "error": "must provide evaluation id"
    });
  }
  else if (!requestBodyValid(req)) {
    res.status(400).json({
      "error": "must provide name, user id, avail date and questions"
    });
  }
  else {
    db.table('evaluations')
      .filter({
        "id": req.params.id
      })
      .update({
        "name": req.body.name,
        "createdBy": req.body.createdBy,
        "resultsAvailableDate": req.body.resultsAvailableDate,
        "isAnonymous": req.body.isAnonymous,
        "status": req.body.status,
        "questions": req.body.questions
      })
      .then(function (result) {
        if (result.replaced == 1 || result.unchanged == 1) {
          res.json({
            "id": req.params.id
          });
        }
        else {
          res.status(404).json({
            error: "evaluation not found"
          });
        }
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({
          "error": "an error occurred updating the record"
        });
      })
  }
};

// TODO check that token belongs to same user that created it
// delete evaluation by id
module.exports.delete = function (req, res) {
  if (!req.params.id) {
    res.status(400).json({
      "error": "must provide evaluation id"
    });
  }
  else {
    db.table('evaluations')
      .filter({
        "id": req.params.id
      })
      .delete()
      .then(function (result) {
        if (result.deleted != 1) {
          res.status(404).json({
            error: "evaluation not found"
          });
        }
        else {
          res.json({
            "deleted": req.params.id
          });
        }
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({
          "error": "an error occurred deleting the record"
        });
      })
  }
};

function requestBodyValid(req) {
  return !(!req.body.name
          || !req.body.createdBy
          || !req.body.resultsAvailableDate
          || !req.body.questions);

}