

// Accounts WIP
// TODO
//

var db = require('../data/db.js');

module.exports.get = function (req, res) {
	console.log(req.params)
	if (!req.params.username) {
		res.json({error: 'must provide username'});
	}
	db.table('accounts')
		.filter({
			"username" : req.params.username
		})
		.limit(1)
		.run()
		.then(function(response) {
			console.log(response)

			if (response.length == 0) {
				res.json({error : "Failed"})
			}
			else {
				res.json(response);
			}
			// TODO check password, etc
		})
		.error(function(err) {
			res.json({error: err});
	})

	//var account = {
	//	username : req.body.username,
	//	password : passwordHash.generate(req.body.password)
	//}
	//db.connect().table('accounts').insert(account, {returnChanges: true}).run(db.connect)
}

module.exports.post = function (req, res) {
	if (!req.body.username) {
		res.json({error:"must provide username"});
	}
	if (!req.body.password) {
		res.json({error:"must provide password"});
	}

	// TODO check for existing users

	db.table('accounts')
		.insert(
			{
				"username" : req.body.username,
				"password" : req.body.password
			})
		.run()
		.then(function(response) {
			res.json(response);
		})
		.error(function(err) {
			res.json({error: err});
		})
}

