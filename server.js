var express = require('express');
var app = express();

var logger = require('morgan');
app.use(logger('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();
app.use('/api', router);

router.get('/', function(req, res) {
	res.json({ message: 'hello world' });
});



app.listen(port);