var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/',function(req,res,next){
    var post=req.body;
    console.log("hahaha");
    async function run() {
        console.log(post);
        if(typeof(post.from)=="undefined" ||typeof(post.to)=="undefined"  )
        {
            res.json(0);
        }
        else{
            var sql=[];
            
            sql.push(post.from);
            sql.push(post.to);
            sql.push(get_now_time());
            sql.push(post.message);
            sql.push(post.type);
            sql.push(post.key);
           var ins=await sqlasnyc("INSERT INTO  `chat`.`chat_log` (`id`,`from` ,`to` , `time` , `message` ,`type` , `key`) VALUES (NULL ,?,?,?,?,?,?)",sql);
           res.json(1);
        }
     }
     run();
})

module.exports = router;
