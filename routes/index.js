var express = require('express');
var auth = require('../middleware/auth.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express bakchodi bakchodi' });
});

module.exports = router;
