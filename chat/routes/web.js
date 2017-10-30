var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('web/index', {
    title: 'PHCHAT'
  });
});
router.get('/register', function (req, res, next) {
  res.render('web/register', {
    title: 'PHCHAT'
  });
});
router.get('/findpass', function (req, res, next) {
  res.render('web/findpass', {
    title: 'PHCHAT'
  });
});
router.post('/findsend', function (req, res, next) {
  var phone = '63' + req.body.phone;
  var id = req.body.id;
  var code = get_num(6);
  async function run() {



    var member = await sqlasnyc("select * from `member_table` where member_id=?  and member_tel=?", [id, phone]);
    var sms = await sqlasnyc('select * from `send_code` where phone_num=? and type=2', [phone]);
    if (sms != 0) { //已经发送过的
      if ((get_now_time() - sms[0].send_time) > 60) {
        if (member == 0) {
          res.json(-2); //找不到這個帳號
        } else {

          var txt = 'Your verification code is:' + code + ',Please use it within 5 minutes【PHCHAT】';
          sms_send(phone, txt, function (result) {
            if (result == 1) {

              sqlQueryMore("update `send_code` set phone_num=?,send_time=?,type=?,code=?,m_uid=? where uid=?", [phone, get_now_time(), 1, code, member[0].uid,sms[0].uid], function (result) {
                res.json(1); //發送成功
              });
            } else if (result == -1) {
              res.json(-1); //鏈接失敗
            } else if (result == 0) {
              res.json(0); //發送失敗
            }
          });
        }
      } else {

        res.json(-3); //提交的太頻繁
      }
    } else {
      //第一次发送
      
        if (member == 0) {
          res.json(-2); //找不到這個帳號
        } else {

      sms_send(phone, txt, function (result) {
        if (result == 1) {
          
          sqlQueryMore("insert into `send_code` set phone_num=?,send_time=?,type=?,code=?,m_uid=?", [phone, get_now_time(), 2, code,member[0].uid], function (result) {
            res.json(1);//发送成功
          });
        } else if (result == -1) {
          res.json(-1);//连接失败
        } else if (result == 0) {
          res.json(0);//发送失败
        }
      });
    }
    }



  }
  run();
})
router.post('/send', function (req, res, next) {
  var phone = '63' + req.body.phone;
  var username = req.body.username;
  var id = req.body.id;
  var code = get_num(6);
  async function run() {
    var member = await sqlasnyc("select * from `member_table` where member_id=? and username=? and member_tel=?", [id, username, phone]);
    var sms = await sqlasnyc('select * from `send_code` where phone_num=? and type=1', [phone]);
    if (sms != 0) { //已经发送过的
      if ((get_now_time() - sms[0].send_time) > 60) {
        if (member != 0) {
          res.json(-2);
        } else {

          var txt = 'Your verification code is:' + code + ',Please use it within 5 minutes【PHCHAT】';
          sms_send(phone, txt, function (result) {
            if (result == 1) {
              res.json(1);
              sqlQueryMore("update `send_code` set phone_num=?,send_time=?,type=?,code=? where uid=?", [phone, get_now_time(), 1, code, sms[0].uid], function (result) {});
            } else if (result == -1) {
              res.json(-1);
            } else if (result == 0) {
              res.json(0);
            }
          });
        }
      } else {
        console.log(sms[0].send_time + '++' + get_now_time());
        res.json(-3);
      }
    } else {
      //第一次发送
      if (member != 0) {
        res.json(-2);
      } else{
      sms_send(phone, txt, function (result) {
        if (result == 1) {
          res.json(1);
          sqlQueryMore("insert into `send_code` set phone_num=?,send_time=?,type=?,code=?", [phone, get_now_time(), 1, code], function (result) {});
        } else if (result == -1) {
          res.json(-1);
        } else if (result == 0) {
          res.json(0);
        }
      });
    }
  }}
  run();
});
router.post('/register', function (req, res, next) {
  var phone = '63' + req.body.phone;
  var username = req.body.username;
  var id = req.body.id;
  var password = req.body.password;
  var code = req.body.code;
  async function run() {
    var member = await sqlasnyc("select * from `member_table` where member_id=? or member_tel=?", [id, username, phone]);
    if (member == 0) {
      var sms = await sqlasnyc('select * from `send_code` where phone_num=? and code=? and send_time>?', [phone, code, get_now_time() - 60 * 5]);
      if (sms != 0) {
        var sql = [];
        sql.push(id);
        sql.push(username);
        sql.push(md5(password));
        sql.push(new Buffer(password).toString('base64'));
        sql.push(phone);
        sql.push(get_now_time());
        await sqlasnyc('insert into `member_table` set member_id=?,username=?,member_pass=?,base_pass=?,member_tel=?,register_date=?', sql);
        user.createUser(id, password);
        user.editNickname(id, username);
        res.json(1);
      } else {
        res.json(-1); //无效验证码
      }
    } else {
      res.json(0); //用户已存在
    }
  }
  run();
})
module.exports = router;