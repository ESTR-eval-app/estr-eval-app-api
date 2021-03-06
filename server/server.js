var express = require('express');
var app = express();

var jwt = require('jsonwebtoken');

var secret = process.env.EVAL_N_TOKEN_KEY;

var checkFinished = require('./data/checkEvaluationFinished.js');

var audio = require('./services/audioStorage.js');
audio.init();

var notifier = require('./services/emailNotify.js');
notifier.init();

var logger = require('morgan');
app.use(logger('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.raw({
  type: 'audio/mp3',
  limit: 3145728 // 3mb
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 3000;

var router = express.Router();

// allow CORS
var cors = require('cors');
app.use(cors());

// route to authenticate with token
router.post("/authenticate", require('./routes/authenticate.js').post);

// publicly accessible routes
router.get('/evaluations', require('./routes/evaluations_public.js').get);
router.get('/evaluations/:id', require('./routes/evaluations_public.js').get);

// route for responses
router.post('/responses', require('./routes/responses.js').post);

// middleware to verify token
router.use(function (req, res, next) {

  var token = req.headers['api-token'];

  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        console.error(err);
        return res.status(403).json({"message": "authentication failed."});
      } else {
        // save token to request
        req.decodedToken = decoded;
        next();
      }
    })
  }
  else {
    res.status(403).json({"message": "no token provided"});
  }

});

// routes for evaluations
router.post('/evaluations', require('./routes/evaluations_protected.js').post);
router.put('/evaluations/:id', require('./routes/evaluations_protected.js').put);
router.delete('/evaluations/:id', require('./routes/evaluations_protected.js').delete);

// routes for question audio
router.post('/evaluations/:evalId/question/:questionId/audio', require('./routes/question_audio').post);
//routes for results
router.get('/evaluations/:evalId/results', require('./routes/results.js').getById);

// routes for accounts
router.get('/accounts', require('./routes/accounts.js').get);
router.get('/accounts/:username', require('./routes/accounts.js').get);
router.post('/accounts', require('./routes/accounts.js').post);
router.put('/accounts/:username', require('./routes/accounts.js').put);
router.delete('/accounts/:username', require('./routes/accounts.js').delete);

app.use('/api', router);
app.use('/audio', express.static(audio.getAudioDirectory()));

app.listen(port);
