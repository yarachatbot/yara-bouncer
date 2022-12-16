var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// maybe put this in another file, containing all auth related functions, and import from there
function verifyLogin(creds){
  // verify if logged in.
  return true;
}

router.get('/start', function(req, res, next) {
  // get user id
  // verify that it's logged in
  if(!verifyLogin(req.creds))
    res.send('Not Logged In');

  // create a new conversation entry in conv table in db
  // save new conv_id to users table in db

  // on success, get starting reply from mind
  firstReply = "<MIND API> Hi, how are you doing today? I am chotu, how can I help you?";

  // onsuccess
  res.send({'status':'Success','reply':firstReply});
});

router.get('/next',function(req, res, next) {
  // get user id
  creds = req.creds || "unverified";

  // verify that it's logged in
  if(!verifyLogin(creds))
  {
    res.send('Not Logged In');
    return;
  }

  // Data entry stuff
  // get conv_id from users table in db
  // save new message to conv table in db

  // on success, get starting reply from MIND
  nextReply = "<MIND API> I'm sorry to hear that babababa";

  // onsuccess
  res.send({'status':'Success','reply':nextReply});
});

module.exports = router;
