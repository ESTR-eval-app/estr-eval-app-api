var express = require('express');
var app = express();

var logger = require('morgan');
app.use(logger('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 3000;

var router = express.Router();

// allow CORS
var cors = require('cors');
app.use(cors());

app.use('/api', router);

// route to test api accessibility
router.get('/test', require('./routes/test.js').get);;

// routes for evaluations
router.get('/evaluations', require('./routes/evaluations.js').get);
router.get('/evaluations/:id', require('./routes/evaluations.js').get);
router.post('/evaluations', require('./routes/evaluations.js').post);
router.put('/evaluations/:id', require('./routes/evaluations.js').put);
router.delete('/evaluations/:id', require('./routes/evaluations.js').delete);

// routes for accounts

//router.get('/accounts/:username', require('./routes/accounts.js').get);
//router.post('/accounts', require('./routes/accounts.js').post);

app.listen(port);