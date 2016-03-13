"use strict";

module.exports.post = function (req, res) {
  var evalId = req.params.evalId;
  var questionId = req.params.questionId;
  console.log('eval ' + evalId + ' question ' + questionId);
  console.log(req);
  // TODO get audio file, send to s3

  // TODO update question in evaluation with the correct path
};