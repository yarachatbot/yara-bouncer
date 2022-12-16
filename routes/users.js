var express = require('express');
var router = express.Router();

var connection = require('../db.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  // save to database
  // prepare cookie for client side application
  var rvalue = {'flag':false,'user_id':null};
  // send cookie
   
  //console.log('entered funtion. req = ',req);
  var rquery = req.query;
  if(rquery.type=='legacy')
  {
    //console.log('yes legacy');
    email = rquery.email;
    name = rquery.name;

    connection.query("INSERT INTO Users (name,email) VALUE (?,?)",[name,email],function (error, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    //console.log("SQL results: ",results);
    if(!error)
    {
      rvalue.flag = true;
      connection.query("SELECT id FROM Users WHERE email=?",[email],function (error, results, fields) {
        rvalue.user_id = results[0].id;
        res.send(rvalue);
      });
    }
    else
      console.log('Error occurred: ',error);
    });
  }

  
});

router.get('/login',function(req, res, next) {
  // Get Credentials from req
  // Verify credentials
  // prepare cookie and send to client side application
  res.send('Logged in');
});

module.exports = router;
