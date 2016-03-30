"use strict";
var db = require('../data/db.js');
var notifier = require('../services/emailNotify.js');

// check four times daily for finished evaluations
setInterval(function () {
  console.log(new Date());
  console.log("Checking for finished evaluations...");
  checkForFinishedEvaluations();
}, 86400000 / 4);

function checkForFinishedEvaluations() {
  db.table('evaluations')
    .then(function (result) {
      result = result.filter(function (evaluation) {
        return evaluation.status != "Finished"
      });
      result.forEach(function (evaluation) {
        if (hasEvaluationFinishDatePassed(evaluation)) {
          setEvaluationFinished(evaluation);
        }
      })
    })
    .error(function (err) {
      console.error(err)
    });
}

function hasEvaluationFinishDatePassed(evaluation) {
    var today = new Date();
    var evalFinishDate = new Date(evaluation.resultsAvailableDate);
    if (today > evalFinishDate) {
      console.log("Evaluation finished - NOW " + today + " FINISH DATE " + evalFinishDate);
      return true;
    }
  return false;
}

function setEvaluationFinished(evaluation) {
  evaluation.status = "Finished";
  db.table('evaluations')
  .filter({
    "id": evaluation.id
  })
  .update({
    "status": evaluation.status
  })
  .then(function (result) {
    if (result.replaced == 1 || result.unchanged == 1) {
      console.log("Evaluation " + evaluation.id + " set to Finished successfully");
      notifier.sendEmailNotification(evaluation.createdBy, evaluation);
    }
    else {
      console.error("Evaluation " + evaluation.id + " not updated");
    }
  })
  .error(function (err) {
    console.error(err);
  })
}