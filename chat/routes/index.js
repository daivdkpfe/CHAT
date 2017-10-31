var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var deviceAgent = req.headers["user-agent"].toLowerCase();
  var agentID = deviceAgent.match(/(iphone|ipod|ipad|android|Windows Phone)/);
  if(typeof(req.query.to)!="undefined")
  {
    if(agentID){
      res.redirect('./web?to='+req.query.to);//重定向//手機
    }else{
      res.redirect('./web?to='+req.query.to);//重定向
    }
  }
  else{
    if(agentID){
      res.redirect('./web');//重定向//手機
    }else{
      res.redirect('./web');//重定向
    }
  }
  
  
});

module.exports = router;
