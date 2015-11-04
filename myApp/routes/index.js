var express = require('express');
var router = express.Router();
var process = require('./process.js');
var getData = require('./getData.js');

/* GET home page. */
router.get('/', process.process);

/* GET Data from mongo */
router.get('/getData', getData.getData);
module.exports = router;
