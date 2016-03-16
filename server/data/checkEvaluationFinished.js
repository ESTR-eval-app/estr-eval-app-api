"use strict";
var db = require('../data/db.js');
var notifier = require('../services/emailNotify.js');

module.exports = function (evaluation) {

  if (evaluation.status != "Finished") {
    var today = new Date();
    var evalFinishDate = new Date(evaluation.resultsAvailableDate);
    if (today > evalFinishDate) {
      console.log("Evaluation finished - NOW " + today + " FINISH DATE " + evalFinishDate);
      evaluation.status = "Finished";
      setEvaluationFinished(evaluation.id);
      notifier.sendEmailNotification(evaluation.createdBy, evaluation);
    }

  }
  return evaluation;

};

function setEvaluationFinished(id) {
  db.table('evaluations')
  .filter({
    "id": id
  })
  .update({
    "status": "Finished"
  })
  .then(function (result) {
    if (result.replaced == 1 || result.unchanged == 1) {
      console.log("Evaluation " + id + " set to Finshed successfully");
    }
    else {
      console.error("Evaluation " + id + " not updated");
    }
  })
  .error(function (err) {
    console.error(err);
  })

}