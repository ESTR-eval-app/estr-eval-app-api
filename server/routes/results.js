"use strict";
var db = require('../data/db.js');

// get results for evaluation
module.exports.getById = function (req, res) {
  var evalId = req.params.evalId;

  getEvaluation(evalId)
    .then(getResults)
    .then(function (results) {
      res.json(results);
    })
    .catch(function (err) {
      console.error(err);
      var code = 500;

      if (err.message == "Evaluation not found") {
        code = 404;
      }
      else if (err.message == "Evaluation not yet finished") {
        code = 400;
      }
      res.status(code).json({message: err.message});
    });
};

function getEvaluation(evalId) {
  return db.table('evaluations')
    .filter({
      "id": evalId
    })
    .limit(1)
    .then(function (result) {
      if (result.length == 0) {
        throw new Error("Evaluation not found");
      }
      else if (result[0].status != "Finished") {
        throw new Error("Evaluation not yet finished");
      }
      else {
        return result[0];
      }
    })
    .error(function (err) {
      throw err;
    })
}

function getResults(evaluation) {
  return db.table('responses')
    .filter({
      evaluationId: evaluation.id
    })
    .orderBy('dateReceived')
    .then(function (responses) {
      return buildResultsObject(evaluation, responses)
    })
    .error(function (err) {
      throw err;
    })
}

function buildResultsObject(evaluation, responses) {

  var resultsObj = {
    evaluationId: evaluation.id,
    numResponses: responses.length,
    responsesStartDate: new Date(responses[0].dateReceived),
    responsesEndDate: new Date(responses[responses.length - 1].dateReceived),
    responseCounts: [],
    qualitativeResponses: []
  };

  evaluation.questions.forEach(function (question, i) {
    var responsesForQuestion = {
      question: i
    };
    // collect qualitative responses to each question in an array
    if (question.type === "Descriptive") {
      responsesForQuestion.responses = [];
      responses.forEach(function (response) {
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
      responsesForQuestion.responses = {};
      responses.forEach(function (response) {
        if (!responsesForQuestion.responses[response.questionResponses[i]]) {
          responsesForQuestion.responses[response.questionResponses[i]] = 0;
        }
        responsesForQuestion.responses[response.questionResponses[i]]++;
      });
      resultsObj.responseCounts.push(responsesForQuestion);
    }
  });

  return resultsObj;
}
