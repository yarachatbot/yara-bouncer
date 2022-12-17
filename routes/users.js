var express = require('express');
var router = express.Router();

var auth = require('../middleware/auth.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/register', async function(req, res, next) {
  var rvalue = {'success':false, 'jwt':null, 'error':null};
   
  var rquery = req.query;
  if(!rquery.type || rquery.type=='legacy')
    rvalue = await auth.legacyRegister(rquery.name,rquery.email,rquery.password);
  else if(rquery.type=='OAuth')
  {
    //some stuff
  }

  console.log('sending response');
  res.send(rvalue);
});

router.get('/login',async function(req, res, next) {
  var rvalue = {'success':false, 'jwt':null, 'error':null};

  var rquery = req.query;
  if(!rquery.type || rquery.type=='legacy')
    rvalue = await auth.legacyLogin(rquery.email,rquery.password);
  else if(rquery.type=="OAuth")
  {
    //some stuff
  }

  res.send(rvalue);
});

module.exports = router;
