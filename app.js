var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var convRouter = require('./routes/conversation');
var db = require('./middleware/db.js');
var auth = require('./middleware/auth.js');

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next(); 
});


db.checkConnection();

/*

/ -> html


/users/register (email,password,name) -> {success,jwt,error}
--------localhost:3000/users/register?type=legacy&email=testemail&name=testname&password=testpass  -> {"success": true, "jwt": "xxx.yyy.zzz", "error":null}

/users/login (email,pass) -> {success,jwt,error}
--------localhost:3000/users/register?type=legacy&password=testpass&email=testemail  -> {"success": true, "jwt": "xxx.yyy.zzz", "error":null}


/conversation/start ()+auth -> {success,reply,error}
--------localhost:3000/conversation/start (with headers.authorization = "bearer xxx.yyy.zzz") -> {
    "success": true,
    "reply": "<MIND API> Hi, how are you doing today? I am chotu, how can I help you?",
    "error": null
}

/conversation/next (message)+auth -> {success,reply,error}
--------localhost:3000/conversation/next?message=imsodepressed (with headers.authorization = "bearer xxx.yyy.zzz") -> {
    "success": true,
    "reply": "<MIND API> Sorry to hear that babababa",
    "error": null
}
*/

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', function(req, res) {
  res.sendFile(__dirname + '/public/register.html');
});

app.get('/chat', function(req, res) {
  res.sendFile(__dirname + '/public/chat.html');
});

app.use('/users', usersRouter);
app.use('/conversation',convRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
