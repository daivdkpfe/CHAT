![](http://chat.meishenmeyong.com/web/images/logo1.png)
# Web 版环信
### 使用环信，Vue，iview，Mysql
### 使用方法
###### 1.到/chat/include/config.js 里更新你数据库的帐号密码
###### 2.到/chat/resources/config.js 里更新你环信的信息
###### 3.到/chat/db里找到数据库结构，并导入数据库（默认数据库名字chat），如数据库名字不一样，请到第一步进行更改
###### 4.如果是在本地，请到/chat/app.js，注销第10行，改为
###### //require('./proxy');
###### 5.cd chat，然后node bin/www 启动服务器，默认监听3000端口，访问localhsot:3000即可打开
###### 6.因为对接的是菲律宾的短信验证，提供帐号如下，也可以到环信后台生成IM用户
- 帐号：123 密码：123
- 帐号：123456 密码：123456

PS：以上仅供参考，后期考虑制作管理后台