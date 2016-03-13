"use strict";
var db = require('../data/db.js');
var audio = require('../data/audioStorage.js');

module.exports.post = function (req, res) {
  var evalId = req.params.evalId;
  var questionId = req.params.questionId;
  console.log('eval ' + evalId + ' question ' + questionId);
  // TODO check that it is audio and mp3

  // TODO check evaluation exists, get evaluation

  var content = req.body;

  audio.storeAudioFile(evalId, questionId, content, function (path, err) {
    if (err) {
      console.error(err);
      res.status(500).json({message: "an error occurred storing the file"});
    }
    else {
      res.json({
        message: "stored successfully",
        uri: 'http://' + req.headers.host + '/' + path
      });
    }
  });

};