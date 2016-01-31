/**
 * Created by stevenlyall on 2016-01-30.
 */
var db = require('../data/db.js');

module.exports.get = function(req, res) {
  res.json(
    {
      message : "Hello, I'm the API"
    }
  );
};