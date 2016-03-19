"use strict";
var fs = require('fs');
var db = require('../data/db.js');
var audioFileDirectory = 'audio';

var daysToRunCleanTask = 0.5; // number of days between audio file clean-ups

module.exports.init = function () {
  console.log('Setting up question audio file store...');

  // checks that the audio file directory exists. If not, creates it
  fs.access(audioFileDirectory, fs.F_OK | fs.R_OK | fs.W_OK, function (err) {
    if (err) {
      console.log('directory \'' + audioFileDirectory + '\' is not accessible. Creating...');
      fs.mkdir(audioFileDirectory, function (err) {
        if (err) {
          throw new Error('Could not create audio file directory');
        }
      });
    }
  });

  // start file clean up task
  setInterval(cleanUpAudioFiles, 86400000 * daysToRunCleanTask);
};


module.exports.getAudioDirectory = function () {
  return audioFileDirectory;
};

module.exports.storeAudioFile = function (evalId, questionId, file, completed) {
  var fileName = evalId + '_q_' + questionId + '.mp3';
  var filePath = audioFileDirectory + '/' + fileName;

  fs.writeFile(filePath, file, function (err) {
    if (err) {
      completed(undefined, err);
    }
    console.log(filePath + ' saved successfully');
    completed(filePath, undefined);
  });
};

function cleanUpAudioFiles() {
  console.log('Cleaning up audio files...');
  fs.readdir(audioFileDirectory, function (err, files) {
    files.forEach(function (filename, i, files) {
      // get the evaluation and question index from each filename
      var splitFile = filename.split('_q_');
      var evaluationId = splitFile[0];
      var questionIndex = splitFile[1].split('.mp3')[0];

      // get the evaluation and check that the audio file references a question, otherwise delete the file
      db.table('evaluations')
        .filter({
          "id": evaluationId
        })
        .limit(1)
        .then(function (result) {
          if (result.length != 0) {
            if (!questionExists(result[0], questionIndex)) {
              console.log('Question ' + questionIndex + ' in evaluation ' + evaluationId + ' does not exist.');
              deleteFile(filename);
            }
          }
          else {
            console.log('Evaluation ' + evaluationId + ' does not exist.');
            deleteFile(filename)
          }
        })
        .error(function (err) {
          console.log('error');
          console.error(err);
        })

    })
  });

  // checks that an evaluation has a question with that index
  function questionExists(evaluation, questionIndex) {
    return evaluation.questions[questionIndex] != undefined;
  }

  // deletes a file from the audio directory
  function deleteFile(filename) {
    console.log('Deleting ' + filename);
    fs.unlink(audioFileDirectory + '/' + filename, function (err) {
      if (err) {
        console.error(err);
      }
    });
  }
}