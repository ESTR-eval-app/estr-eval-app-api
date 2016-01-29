var db = require('../data/db.js');

// TODO protect updates and deletion so only possible by user that owns the evaluation

// get evaluation by id
module.exports.get = function (req, res) {
	if (!req.params.id) {
		res.status(400).json({"error" : "must provide evaluation id"});
	}
	else {
		db.table('evaluations')
			.filter({
				"id" : req.params.id
			})
			.limit(1)
			.run()
			.then(function(result) {
				if (result.length == 0) {
					res.status(404).json({error : "evaluation not found"});
				}
				else {
					res.json(result);
				}
			})
			.error(function(err) {
				console.log(err);
				res.status(500).json({"error" : "an error occurred getting the record"});
			})
	}
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

// update evaluation by id
module.exports.put = function(req, res) {
		if (!req.params.id) {
			res.status(400).json({"error" : "must provide evaluation id"});
		}
		else if (!req.body.name || !req.body.createdBy || !req.body.resultsAvailableDate || !req.body.questions) {
			res.status(400).json({"error" : "must provide name, user id, avail date and questions"});
		}
		else {
			db.table('evaluations')
				.filter({
					"id" : req.params.id
				})
				.update({
					"name": req.body.name,
					"createdBy" : req.body.createdBy,
					"resultsAvailableDate" : req.body.resultsAvailableDate,
					"isAnonymous" : req.body.isAnonymous,
					"isPublished" : req.body.isPublished,
					"questions" : req.body.questions
				})
				.then(function(result) {
					if (result.replaced == 1 || result.unchanged == 1) {
						res.json({"id" : req.params.id});
					}
					else {
						console.log(result)
						res.status(404).json({error : "evaluation not found"});
					}
				})
				.error(function(err) {
					console.log(err);
					res.status(500).json({"error" : "an error occurred updating the record"});
				})
		}
}

// delete evaluation by id
module.exports.delete = function(req, res) {
	if (!req.params.id || !req.body.username) {
		res.status(400).json({"error" : "must provide evaluation id and username"});
	}
	else {
		db.table('evaluations')
			.filter({
				"id" : req.params.id
			})
			.delete()
			.then(function(result) {
				if (result.deleted != 1) {
					console.log(result)
					res.status(404).json({error : "evaluation not found"});
				}
				else {
					res.json({"deleted" : req.params.id});
				}
			})
			.error(function(err) {
				console.log(err);
				res.status(500).json({"error" : "an error occurred deleting the record"});
			})
	}
}