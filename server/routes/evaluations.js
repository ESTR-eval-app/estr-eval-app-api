var db = require('../data/db.js');

module.exports.get = function (req, res) {
	// TODO retrieve an evaluation by id
}

// create evaluation
module.exports.post = function(req, res){
	if (!req.body.name || !req.body.createdBy || !req.body.resultsAvailableDate || !req.body.questions) {
		res.status(400).json({"error" : "must provide name, user id, avail date and questions"});

	}
	else {
	db.table('evaluations')
		.insert(
			{
				"name": req.body.name,
				"createdBy" : req.body.createdBy,
				"resultsAvailableDate" : req.body.resultsAvailableDate,
				"isAnonymous" : req.body.isAnonymous,
				"isPublished" : req.body.isPublished,
				"questions" : req.body.questions
			}
		)
		.run()
		.then(function(result) {
			res.json({"id" : result.generated_keys[0]});
		})
		.error(function(err) {
			console.log(err);
			res.status(500).json({"error" : "an error occurred inserting the record"});
		})
	}
}

module.exports.put = function(req, res) {
	// TODO update an evaluation by id
}

module.exports.delete = function(req, res) {
	// TODO delete an evaluation by id
}