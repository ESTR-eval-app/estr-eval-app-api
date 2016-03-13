"use strict";
var db = require('../data/db.js');
var fs = require('fs');
// TODO put in  env var at start, check points to dir.
var audioFileDirectory = 'audio';

module.exports.post = function (req, res) {
  var evalId = req.params.evalId;
  var questionId = req.params.questionId;
  console.log('eval ' + evalId + ' question ' + questionId);
  // TODO check that it is audio and mp3

  // TODO check evaluation exists, get evaluation

  var content = req.body;
  var targetFile = evalId + '_q_' + questionId + '.mp3';
  var filePath = audioFileDirectory + '/' + targetFile;

  fs.writeFile(filePath, content, function (err) {
    if (err) {
      throw new Error("Problem writing file to disk");
    }
    //updateQuestionAudio()
  });


  //db.table('questionAudio')
  //  .insert(
  //    {
  //      "evaluationId": evalId,
  //      "questionId": questionId,
  //      "fileName": targetFile,
  //      "fileSize": content.length,
  //      "fileContent": content
  //    }
  //  )
  //  .then(function (result) {
  //    console.log('inserted');
  //    console.log(result);
  //    res.json({"id": result.generated_keys[0]});
  //  })
  //  .catch(function(err){
  //    console.error(err);
  //    res.status(500).json({'message':"fail"});
  //  });


  //});


  //function updateQuestionAudio() {
  //  db.table('evaluations')
  //    .filter({
  //      "id": evalId
  //    })
  //    .limit(1)
  //    .then(function (result) {
  //      if (result.length == 0) {
  //        res.status(404).json({error: "evaluation not found"});
  //      }
  //      else {
  //        return result.questions[questionId].audioPath
  //      };
  //    })
  //
  //  db.table('evaluations')
  //    .filter({
  //      "id": evalId
  //    })
  //    .update({
  //      questions[questionId].audioath : req.body.questions,
  //
  //    })
  //    .then(function (result) {
  //      if (result.replaced == 1 || result.unchanged == 1) {
  //        res.json({
  //          "id": req.params.id
  //        });
  //      }
  //      else {
  //        res.status(404).json({
  //          error: "evaluation not found"
  //        });
  //      }
  //    })
  //    .error(function (err) {
  //      console.log(err);
  //      res.status(500).json({
  //        "error": "an error occurred updating the record"
  //      });
  //    })
  //}

  //send to s3


  // TODO update question in evaluation with the correct path, reply with path of resource
};