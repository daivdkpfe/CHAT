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
            if(typeof(post.key)=='undefined')
            {
                post.key='IOS';
            }
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
router.post("/query",function(req,res,next)
{
    var p1 =req.body.peopleone;
    var p2 =req.body.peopletwo;
    var start=(req.body.page-1)*30;
    var end =(req.body.page)*30;
    var page=req.body.page;
    if(page>0)
    {

    }
    else{
        page=1;
    }
    var sql=[];
    sql.push(p1);
    sql.push(p2);
    sql.push(p2);
    sql.push(p1);

    async function run() {
        var chat_log=await sqlasnyc('select * from `chat_log` where (`from` =? and `to`=?) or (`from` =? and `to`=?) order by time desc limit '+start+','+end,sql);

        if(chat_log!=0)
        {
            chat_log.forEach(function(element,index) {
                chat_log[index]['time']=element['time'];
            }, this);
            if(page==1);
            {
                var count=await sqlasnyc('select count(*) from `chat_log` where (`from` =? and `to`=?) or (`from` =? and `to`=?) ',sql);
                console.log(count);
                chat_log[0]['count']=count['0'].count;
            }
        }
        
        console.log(chat_log);
        res.json(chat_log);
    };
    run();
})
module.exports = router;
