"use strict";

var db = require('../data/db.js');

module.exports.post = function (req, res) {
console.log(req.body);
  if (!req.body.evaluationId || !req.body.questionResponses || req.body.questionResponses.length < 1) {
    res.status(400).json({"error": "must provide evaluation id and question responses"});
  }
  else {
    var record = {
      evaluationId : req.body.evaluationId,
      dateReceived : new Date().toString(),
      questionResponses : req.body.questionResponses
    };
    if (req.body.name) {
      record.name = req.body.name;
    }

    db.table('responses')
      .insert(record)
      .then(function (result) {
          res.json({"message": "success"});
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({"error": "an error occurred adding the record"});
      })
  }

}