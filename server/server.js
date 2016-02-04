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

app.use(verifyToken);

// route to authenticate accounts
router.post("/authenticate", require('./routes/authenticate.js').post);
// route to test api accessibility
router.get('/test', require('./routes/test.js').get);

// routes for evaluations
//router.get('/evaluations', require('./routes/evaluations.js').get);
//router.get('/evaluations/:id', require('./routes/evaluations.js').get);
//router.post('/evaluations', require('./routes/evaluations.js').post);
//router.put('/evaluations/:id', require('./routes/evaluations.js').put);
//router.delete('/evaluations/:id', require('./routes/evaluations.js').delete);
//
//// routes for accounts
//router.get('/accounts', require('./routes/accounts.js').get);
//router.get('/accounts/:username', require('./routes/accounts.js').get);
//router.post('/accounts', require('./routes/accounts.js').post);
//router.put('/accounts/:username', require('./routes/accounts.js').put);
//router.delete('/accounts/:username', require('./routes/accounts.js').delete);


app.listen(port);

function verifyToken(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'secret', function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                console.log(decoded);
                next();
            }
        })
    }
    else {
        res.status(403).json({"message": "no token provided"});
    }
}
