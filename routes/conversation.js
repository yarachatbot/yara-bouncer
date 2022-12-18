var express = require('express');
var auth = require('../middleware/auth.js');
var dataentry = require('../middleware/dataentry.js')

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('For usage, check comments in app.js');
});

// maybe put this in another file, containing all auth related functions, and import from there
router.get('/start', function(req, res, next) {
  var rvalue = {'success':false,'reply':null,error:null};

  // verify that it's logged in
  var token = (req.headers.authorization || "bearer dumbass").split(' ')[1]
  var user_id = auth.verifyJWT(token);
  console.log('Verified: ',user_id);
  if(!user_id)
  {
    rvalue.error = "Invalid Login";
  }
  else
  {
    //get starting reply from mind
    firstReply = "<MIND API> Hi, how are you doing today? I am chotu, how can I help you?";

    // onsuccess
    rvalue.reply = firstReply;
    rvalue.success = true;

    // creating new conv, and doing data entry shit
    dataentry.startConv(user_id,firstReply);
  }
  console.log('Sending rvalue from router/start');
  res.send(rvalue);
});

router.get('/next',function(req, res, next) {
  var rvalue = {'success':false,'reply':null,error:null};

  // verify that it's logged in
  var user_id = auth.verifyJWT(req.headers.authorization.split(' ')[1]);
  if(!user_id)
  {
    rvalue.error = "Invalid Login";
  }
  else
  {
    // create a new conversation entry in conv table in db
    // save new conv_id to users table in db

    var rquery = req.query;
    var message = rquery.message;
    // on success, get starting reply from mind
    nextReply = "<MIND API> Sorry to hear: "+message;

    // onsuccess
    rvalue.reply = nextReply;
    rvalue.success = true;

    dataentry.nextConv(user_id,message,nextReply);
  }
  
  res.send(rvalue);
});

module.exports = router;
