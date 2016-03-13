"use strict";
var db = require('../data/db.js');

// get results for evaluation
module.exports.getById = function (req, res) {
  getEvaluation(req, res, checkForEvaluationResults);
  // first check that evaluation is finished
};

function getEvaluation(req, res, callback) {
  var evalId = req.params.evalId;
  db.table('evaluations')
    .filter({
      "id": evalId
    })
    .limit(1)
    .run()
    .then(function (result) {
      if (result.length == 0) {
        res.status(404).json({error: "evaluation not found"});
      }
      else if (result[0].status != "Finished") {
        res.status(403).json({error: "the evaluation has not yet finished"});
      }
      else {
        callback(req, res, result[0]);
      }
    })
    .error(function (err) {
      console.log(err);
      res.status(500).json({"error": "an error occurred getting the record"});
    })
}

function checkForEvaluationResults(req, res, evaluation) {
  db.table('responses')
    .filter({
      evaluationId: evaluation.id
    })
    .orderBy('dateReceived')
    .then(function (responses) {
      buildResultsObject(req, res, evaluation, responses);
    })
    .error(function (err) {
      console.log(err);
      res.status(500).json({"error": "an error occurred getting the record"});
    })
}

function buildResultsObject(req, res, evaluation, responses) {


  var isAnonymous = evaluation.isAnonymous;

  var resultsObj = {
    evaluationId: evaluation.id,
    numResponses: responses.length,
    responsesStartDate: new Date(responses[0].dateReceived),
    responsesEndDate: new Date(responses[responses.length - 1].dateReceived),
    responseCounts: [],
    qualitativeResponses: []
  };

  evaluation.questions.forEach(function (question, i, questions) {
    // collect qualitative responses to each question in an array
    if (question.type === "Descriptive") {
      var responsesForQuestion = {
        question: i,
        responses: []
      };
      responses.forEach(function (response, j, responses) {
        var record = {text: response.questionResponses[i]};
        if (!evaluation.isAnonymous) {
          record.name = response.name;
        }
        responsesForQuestion.responses.push(record);
      });
      resultsObj.qualitativeResponses.push(responsesForQuestion);
    }
    else {
      // count response values for each quantitative question
      var responsesForQuestion = {
        question: i,
        responses: {}
      };
      responses.forEach(function (response, j, responses) {
        if (!responsesForQuestion.responses[response.questionResponses[i]]) {
          responsesForQuestion.responses[response.questionResponses[i]] = 0;
        }
        responsesForQuestion.responses[response.questionResponses[i]]++;
      });
      resultsObj.responseCounts.push(responsesForQuestion);
    }
  });

  res.json(resultsObj);
}
