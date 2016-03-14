"use strict";
var fs = require('fs');
var audioFileDirectory = 'audio';

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

// TODO check for orphaned audio files and clean up