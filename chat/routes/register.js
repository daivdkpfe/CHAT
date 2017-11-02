var express = require('express');
var router = express.Router();

/* GET users listing. */



router.post('/',function(req,res,next){
  var phone = '63' + req.body.phone;
  var username = req.body.username;
  var id = req.body.id;
  var member_pass=req.body.member_pass;
  var base_pass=req.body.base_pass;
  var password=req.body.password;
  
  async function run() {
    var member = await sqlasnyc("select * from `member_table` where member_id=? or member_tel=?", [id, username, phone]);
    if(member== 0)
    {
      
        var sql=[];
        sql.push(id);
        sql.push(username);
        sql.push(member_pass);
        sql.push(base_pass);
        sql.push(phone);
        sql.push(get_now_time());        
        await sqlasnyc('insert into `member_table` set member_id=?,username=?,member_pass=?,base_pass=?,member_tel=?,register_date=?',sql);
        user.createUser(id, password);
        user.editNickname(id, username);
        res.json(1);//註冊成功
    }
    else{
      res.json(0);//用户已存在
    }
  }
  run();
})
module.exports = router;