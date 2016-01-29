var r = require('rethinkdbdash')({
	db: 'estr_app',
	host : process.env.ESTR_API_DB_HOST,
	port: process.env.ESTR_API_DB_PORT
});

module.exports = r;