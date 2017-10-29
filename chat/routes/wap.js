var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('wap/index', { title: 'PHCHAT' });
});

module.exports = router;
