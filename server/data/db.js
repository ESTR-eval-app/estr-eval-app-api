var r = require('rethinkdbdash')({
	db: 'estr_app',
  host: process.env.EVAL_N_DB_HOST,
  port: process.env.EVAL_N_DB_PORT
});

module.exports = r;