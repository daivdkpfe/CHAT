/**
 * Created by Administrator on 2017/5/1.
 */


//環信
var conn = new WebIM.connection({
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    isAutoLogin: WebIM.config.isAutoLogin,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions
});
WebIM.Emoji = {
    path: 'images/Emoji/'  /*表情包路径*/
    , map: {
        '[):]': 'ee_1.png',
        '[:D]': 'ee_2.png',
        '[;)]': 'ee_3.png',
        '[:-o]': 'ee_4.png',
        '[:p]': 'ee_5.png',
        '[(H)]': 'ee_6.png',
        '[:@]': 'ee_7.png',
        '[:s]': 'ee_8.png',
        '[:$]': 'ee_9.png',
        '[:(]': 'ee_10.png',
        '[:\'(]': 'ee_11.png',
        '[:|]': 'ee_12.png',
        '[(a)]': 'ee_13.png',
        '[8o|]': 'ee_14.png',
        '[8-|]': 'ee_15.png',
        '[+o(]': 'ee_16.png',
        '[o)]': 'ee_17.png',
        '[|-)]': 'ee_18.png',
        '[*-)]': 'ee_19.png',
        '[:-#]': 'ee_20.png',
        '[:-*]': 'ee_21.png',
        '[^o)]': 'ee_22.png',
        '[8-)]': 'ee_23.png',
        '[(|)]': 'ee_24.png',
        '[(u)]': 'ee_25.png',
        '[(S)]': 'ee_26.png',
        '[(*)]': 'ee_27.png',
        '[(#)]': 'ee_28.png',
        '[(R)]': 'ee_29.png',
        '[({)]': 'ee_30.png',
        '[(})]': 'ee_31.png',
        '[(k)]': 'ee_32.png',
        '[(F)]': 'ee_33.png',
        '[(W)]': 'ee_34.png',
        '[(D)]': 'ee_35.png'
    }
};
conn.listen({
    onOpened: function ( message ) {
        //连接成功回调
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();
        $(".main-div").load("chat.html",function(){
            friend();
        });
        


    },          //打开连接
    onClosed: function ( message ) {

        $(".main-div").load("login.html");
        $.cookie('page', null);
        $.cookie('to', null);
        $.cookie('username', null);
        return false;
    },         //连接关闭回调
    onTextMessage: function ( message ) {
        console.log(message);
        if(message.type=="chat")
        {
            if($(".chatting").hasClass(message['from']))
            {

                if(message['delay']){
                    var time=UTC(message['delay']);
                }
                else
                {
                    var time=getNowFormatDate();
                }

                addReceiveMessage(message["data"],message['from'],time);

            }else
            {

                $(".chat-list").append('<div class="hide chatting '+message['from']+'"></div>');
                if(message['delay']){
                    var time=UTC(message['delay']);
                }
                else
                {
                    var time=getNowFormatDate();

                }

                addReceiveMessage(message["data"],message['from'],time);

            }
        }



    },    //收到文本消息
    onEmojiMessage: function ( message ) {

        var allMessages="";

        var data = message.data;
        for(var i = 0 , l = data.length ; i < l ; i++){

            if(data[i]["type"]=="emoji")
            {
                allMessages=allMessages+'<img src='+data[i]["data"]+' class="message-emoji">';
            }
            else
            {
                allMessages=allMessages+data[i]["data"];
            }

        }
        if($(".chatting").hasClass(message['from']))
        {
            if(message['delay']){
                var time=UTC(message['delay']);
            }
            else
            {
                var time=getNowFormatDate();
            }

            addReceiveMessage(allMessages,message['from'],time);

        }else
        {

            $(".chat-list").append('<div class="hide chatting '+message['from']+'"></div>');
            if(message['delay']){
                var time=UTC(message['delay']);
            }
            else
            {
                var time=getNowFormatDate();

            }
            addReceiveMessage(allMessages,message['from'],time);


        }


    },   //收到表情消息
    onPictureMessage: function ( message ) {
            console.log(message);
        if($(".chatting").hasClass(message['from']))
        {
            var img="<img class='send-img' src='"+message["url"]+"'>";
            if(message['delay']){
                var time=UTC(message['delay']);
            }
            else
            {
                var time=getNowFormatDate();
            }

            addReceiveMessage(img,message['from'],time,2);

        }else
        {

            var img="<img class='send-img' src='"+message["url"]+"'>";
            $(".chat-list").append('<div class="hide chatting '+message['from']+'"></div>');
            if(message['delay']){
                var time=UTC(message['delay']);
            }
            else
            {
                var time=getNowFormatDate();

            }

            addReceiveMessage(img,message['from'],time,2);

        }
    }, //收到图片消息
    onCmdMessage: function ( message ) {},     //收到命令消息
    onAudioMessage: function ( message ) {
        var options = { url: message.url };

        options.onFileDownloadComplete = function ( response ) {
            //音频下载成功
        };

        options.onFileDownloadError = function () {
            //音频下载失败
        };

        //通知服务器将音频转为mp3
        options.headers = {
            'Accept': 'audio/mp3'
        };

        WebIM.utils.download.call(conn, options);


        if($(".chatting").hasClass(message['from']))
        {
            var img="<div class='audio_play'><img class='msg-audio-img' src='images/audio.png'><p class='msg-audio-length' src='"+message.url+"'>"+message.length+"\"</p></div>";
            if(message['delay']){
                var time=UTC(message['delay']);
            }
            else
            {
                var time=getNowFormatDate();
            }

            addReceiveMessage(img,message['from'],time,4);

        }else
        {

            var img="<div class='audio_play'><img class='msg-audio-img' src='images/audio.png'><p class='msg-audio-length' src='"+message.url+"'>"+message.length+"\"</p></div>";
            $(".chat-list").append('<div class="hide chatting '+message['from']+'"></div>');
            if(message['delay']){
                var time=UTC(message['delay']);
            }
            else
            {
                var time=getNowFormatDate();
            }

            addReceiveMessage(img,message['from'],time,4);

        }


        console.log(message);


    },   //收到音频消息
    onLocationMessage: function ( message ) {},//收到位置消息
    onFileMessage: function ( message ) {
        console.log(message);

        if($(".chatting").hasClass(message['from']))
        {
            var img="<div class='message-file-top'>File</div><div class='message-file-bottom'><img class='file_img' src='images/message_file.png' alt=''><p class='file_name'>"+message.filename+"</p><p class='file_down_url'><a href='"+message.url+"'>Click downland</a></p></div>";
            if(message['delay']){
                var time=UTC(message['delay']);
            }
            else
            {
                var time=getNowFormatDate();
            }

            addReceiveMessage(img,message['from'],time,3);

        }else
        {

            var img="<div class='message-file-top'>File</div><div class='message-file-bottom'><img class='file_img' src='images/message_file.png' alt=''><p class='file_name'>"+message.filename+"</p><p class='file_down_url'><a href='"+message.url+"'>Click downland</a></p></div>";
            $(".chat-list").append('<div class="hide chatting '+message['from']+'"></div>');
            if(message['delay']){
                var time=UTC(message['delay']);
            }
            else
            {
                var time=getNowFormatDate();

            }

            addReceiveMessage(img,message['from'],time,3);

        }


    },    //收到文件消息
    onVideoMessage: function (message) {
        var node = document.getElementById('privateVideo');
        var option = {
            url: message.url,
            headers: {
                'Accept': 'audio/mp4'
            },
            onFileDownloadComplete: function (response) {
                var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                node.src = objectURL;
            },
            onFileDownloadError: function () {
                console.log('File down load error.')
            }
        };
        WebIM.utils.download.call(conn, option);
    },   //收到视频消息
    onPresence: function ( message ) {

        switch (message.type) {
            case 'subscribe':                           // 对方请求添加好友
                // 同意对方添加好友
                $(".mask-agreeAdd").toggle();
                $(".agree-friend-name").html(message.from);
                // 拒绝对方添加好友
                break;
            case 'subscribed':                          // 对方同意添加好友，已方同意添加好友
                console.log(message);
                $(".chat-"+message.from).remove();

                $(".chat-div-main-top").html('<div class="chat-list-div  chat-'+message.from+'"><img src="images/portrait.jpg" class="chat-portrait" alt=""><p class="chat-username">'+message.from+'</p><p class="recent-message"></p></div>'+$(".chat-div-main-top").html());
                break;
            case 'unsubscribe':                         // 对方删除好友
                $(".chat-"+message.from).remove();
                removeFriends(message.from);
                break;
            case 'unsubscribed':                        // 被拒绝添加好友，或被对方删除好友成功
                $(".chat-"+message.from).remove();
                removeFriends(message.from);
                break;
            case 'joinChatRoomSuccess':                 // 成功加入聊天室
                console.log('join chat room success');
                break;
            case 'joinChatRoomFaild':                   // 加入聊天室失败
                console.log('join chat room faild');
                break;
            case 'joinPublicGroupSuccess':              // 意义待查
                console.log('join public group success', message.from);
                break;
        }

        // 用append或者刪除節點處理
    },       //收到联系人订阅请求、处理群组、聊天室被踢解散等消息，好友變動
    onRoster: function ( message ) {},         //处理好友申请
    onInviteMessage: function ( message ) {},  //处理群组邀请
    onOnline: function () {},                  //本机网络连接成功
    onOffline: function () {},                 //本机网络掉线
    onError: function ( message ) {},          //失败回调
    onBlacklistUpdate: function (list) {       //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list);
    }
});

//註冊
function register(user,pass,nick) {
    var options = {
        username: user,
        password: pass,
        nickname: nick,
        appKey: WebIM.config.appkey,
        success: function () {
            alert("Register successful");
            login(user,pass);
        },
        error: function () {
            alert("ID already exists");
        },
        apiUrl: WebIM.config.apiURL
    };
    conn.registerUser(options);
}
//    var options = {
//        username: 'username',
//        password: 'password',
//        nickname: 'nickname',
//        appKey: WebIM.config.appkey,
//        success: function () { },
//        error: function () { },
//        apiUrl: WebIM.config.apiURL
//    };
   //conn.registerUser(options);
//註冊結束

//    登錄開始
function login(user,pass) {
    page.spinShow=true;
    var options = {
        apiUrl: WebIM.config.apiURL,
        user: user,
        pwd: pass,
        appKey: WebIM.config.appkey,
        success: function (token) {
            
            $.cookie("username",user);
            $.cookie("webim_"+token.user.username,token.access_token);
            // alert($.cookie('webim_' + encryptUsername));
        },
        error: function(){
            page.spinShow=false;
            page.loginerr();
        }
    };

    conn.open(options);
}
//    登錄結束

// token登錄
function tokenLogin(){
        
        var username=$.cookie("username");
        var token= $.cookie("webim_"+username,token);
        var options = {
            apiUrl: WebIM.config.apiURL,
            user:username,
            accessToken: token,
            appKey: WebIM.config.appkey,
            success: function (token) {
                // alert($.cookie('webim_' + encryptUsername));
            },
            error: function(){
                $(".main-div").load("login.html");
            }
        };
        conn.open(options);

}

// token 登錄結束


// 单聊发送文本消息
   function sendMessages (message,to) {
       var id = conn.getUniqueId();                 // 生成本地消息id
       var msg = new WebIM.message('txt', id);      // 创建文本消息
       msg.set({
           msg: message,                  // 消息内容
           to: to,                          // 接收消息对象（用户id）
           roomType:false,
           success: function (id, serverMsgId) {
               // console.log('send private text Success');
               $.ajax({ url: "../chat",
                   type:'post',
                   data: {
                   'from':$.cookie("username"),
                   "to":to,
                   "message":escape(message),
                   "type":1,
                   "key":'web'
               },
                   success: function(req){

               },
                   error:function () {
                       page.instance('error')
                   }
               });
               //end ajax
           }
       });
       msg.body.chatType = 'singleChat';

       conn.send(msg.body);
   };
//    單聊發送文本消息結束

// 查询好友列表
function friend() {
    conn.getRoster({
        success: function ( roster ) {
            //获取好友列表，并进行好友列表渲染，roster格式为：
            /** [
             {
               jid:'asemoemo#chatdemoui_test1@easemob.com',
               name:'test1',
               subscription: 'both'
             }
             ]
             */
            console.log(roster);
            var friendList=$(".chat-div-main-top").html();
            for ( var i = 0, l = roster.length; i < l; i++ ) {
                var ros = roster[i];
                //ros.subscription值为both/to为要显示的联系人，此处与APP需保持一致，才能保证两个客户端登录后的好友列表一致
                if($(".chat-list-div").hasClass("chat-"+roster[i]["name"]))
                {

                }
                else
                {
                    if ( ros.subscription === 'both' || ros.subscription === 'to' ) {
                        friendList= friendList +'<div class="chat-list-div  chat-'+roster[i]["name"]+'"><p class="unread"></p><img src="images/portrait.jpg" class="chat-portrait" alt=""><p class="chat-username">'+roster[i]["name"]+'</p><p class="recent-message"></p></div>';
                    }
                    if ( ros.subscription === 'none') {
                        friendList= friendList +'<div class="chat-list-div  chat-'+roster[i]["name"]+'"><img src="images/portrait.jpg" class="chat-portrait" alt=""><p class="chat-username">'+roster[i]["name"]+'</p><p class="isNoFriend">（'+page.lang._041+'）</p><p class="recent-message"></p></div>';
                    }
                }

            }

            $(".chat-div-main-top").html(friendList);
            if($.cookie("toUser")!="")
            {
                $(".chat-"+$.cookie("toUser")).trigger('click');
            }
        },
    });

}
// 查询好友列表结束
function removeSelectId() {
    $(".select-id").removeClass("select-id");
}

// 打開聊天介面
function userChatting() {

    var username=$(".select-id").find(".chat-username").html();
    $(".chatting-username").html(username);
    $(".setting-div").show();
    if($(".chatting").hasClass(username))
    {
       $(".chatting").hide();
       $("."+username).show();
    }else
    {
        $(".chatting").hide();
        $(".chat-list").append('<div class="chatting '+username+'"></div>');
    }
}
// 發送消息添加記錄到聊天介面
function addSendMessage(message) {
    var message = arguments[0] ? arguments[0] : message;
    var type = arguments[1] ? arguments[1] : 1;
    var emojibody = WebIM.utils.parseTextMessage(message, WebIM.Emoji);
   // console.log(emojibody);
        var data=emojibody.body;
    // console.log(data);

    var allMessages="";
    // var data = message.data;

    // 循環打出表情
    for(var i = 0 , l = data.length ; i < l ; i++){
        // console.log(data[i]);
        if(data[i]["type"]=="emoji")
        {
            allMessages=allMessages+'<img src='+data[i]["data"]+' class="message-emoji">';
        }
        else
        {
            allMessages=allMessages+data[i]["data"];
        }

    }
        // 循環打出表情結束
            message=allMessages;


        var username=$(".select-id").find(".chat-username").html(); //找到發送給哪個用戶
        $("."+username).append('<div class="chat-send-message"><div class="chat-send-message-time right"><img src="images/portrait.jpg" class="chatting-portrait right" alt=""><p class="right send-message-time">'+getNowFormatDate()+'</p><div class="sended-message right sended">'+message+'</div></div></div>');
        // ↑聊天框裏面加入消息
        // ↓好友列表顯示最近的一条消息
        // 开始判断消息的类型，图片和文件显示文字就好了
        if(type==2)
        {
            $(".chat-"+username).find(".recent-message").html("[ Picture ]");
        }
        else if(type==3)
        {
            $(".chat-"+username).find(".recent-message").html("[ File ]");
        }
        else
        {
            $(".chat-"+username).find(".recent-message").html(message);
        }


        // ↓滚动到最下
        $('.'+username).scrollTop( $('.'+username)[0].scrollHeight);




}
function addReceiveMessage(message,from,time) {
    var message = arguments[0] ? arguments[0] : message;
    var from = arguments[1] ? arguments[1] : 'admin';
    var time = arguments[2] ? arguments[2] : getNowFormatDate();
    var type = arguments[3] ? arguments[3] : 0;

    if($(".chat-list-div").length)//好友列表已加載
    {
        if(!$(".chat-list-div").hasClass("chat-"+from))//好友列表有沒有這個人
        {
            $(".chat-div-main-top").html($(".chat-div-main-top").html()+'<div class="chat-list-div  chat-'+from+'"><img src="images/portrait.jpg" class="chat-portrait" alt=""><p class="chat-username">'+from+'</p><p class="isNoFriend">（'+page.lang._041+'）</p><p class="recent-message"></p></div>');

        }
        $("."+from).append('<div class="chat-receive-message"><div class="chat-receive-message-time left"><img src="images/portrait.jpg" class="chatting-portrait left" alt=""><p class="left receive-message-time">'+time+'</p><div class="receiveed-message left receiveed">'+message+'</div></div></div>');

        if(type==2)
        {
            $(".chat-"+from).find(".recent-message").html("[ picture ]");
        }
        else if(type==3)
        {
            $(".chat-"+from).find(".recent-message").html("[ file ]");
        }
        else if(type==4)
        {
            $(".chat-"+from).find(".recent-message").html("[ audio ]");
        }
        else
        {
            $(".chat-"+from).find(".recent-message").html(message);
        }

        // 消息提示处理
        if($(".chat-"+from).hasClass("select-id"))
        {

        }
        else
        {

            $(".chat-"+from).find(".unread").show();
        }
        // 消息提示处理End

        // alert( $(".chat-"+from).prop("outerHTML"));
        $('.'+from).scrollTop( $('.'+from)[0].scrollHeight );
    }
    else //好友列表沒加載
    {
        setTimeout(function(){
            if(!$(".chat-list-div").hasClass("chat-"+from))//好友列表有沒有這個人，用於離綫消息
            {
                $(".chat-div-main-top").html($(".chat-div-main-top").html()+'<div class="chat-list-div  chat-'+from+'"><img src="images/portrait.jpg" class="chat-portrait" alt=""><p class="chat-username">'+from+'</p><p class="isNoFriend">（'+page.lang._041+'）</p><p class="recent-message"></p></div>');

            }
            addReceiveMessage(message,from,time);

        },1000);

    }

}



function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}
// 當前時間，不能注釋，發送的時候獲取

// 转换UTC时间
function UTC(time) {
    var date2 = new Date(time);

    var localeString = date2.toLocaleString();
    localeString=localeString.replace("/","-");
    localeString=localeString.replace("/","-");
    localeString=localeString.replace("上午","");
    localeString=localeString.replace("下午","-");
    return localeString;
}

// 获取聊天记录
function gethistory(peopleone,peopletwo,pages) {
    $.ajax({ url: "../chat/query",
        type:'post',
        data: {
            'peopleone':peopleone,
            "peopletwo":peopletwo,
            "page":pages
        },
        dataType: "json",
        success: function(req){
            $(".history-record-list").html("");
            for(var i=0; i<req.length; i++){
                // alert(req["0"]["count"]);
                if(req["0"]["count"]!="0")
                {
                    //                            处理表情
                    if(req[i]["type"]==1) {

                        var emojibody = WebIM.utils.parseTextMessage(req[i]["message"], WebIM.Emoji);
                        // console.log(emojibody);
                        var data = emojibody.body;
                        // console.log(data);

                        var allMessages = "";
                        // var data = message.data;
                        for (var j = 0, l = data.length; j < l; j++) {
                            // console.log(data[i]);
                            if (data[j]["type"] == "emoji") {
                                allMessages = allMessages + '<img src=' + data[j]["data"] + ' class="message-emoji">';
                            }
                            else {


                                allMessages = allMessages+data[j]["data"];
                            }

                        }
                    }
                    //                            处理表情结束
                    else if(req[i]["type"]==2)
                    {
                        var allMessages = "";
                        allMessages="<img class='send-img' src='"+req[i]["message"]+"'>";
                    }
                    else if(req[i]['type']==3)
                    {
                        var allMessages = "";
                        allMessages="<a href='"+req[i]["message"]+"'>Click Download</a>";
                    }
                    $(".history-record-list").append('<p class="history-record-from">'+req[i]["from"]+'</p><p class="history-record-time">'+req[i]["time"]+'</p> <p class="history-record-message">'+allMessages+'</p>');
                }
                else
                {
                    $(".history-record-list").append("<p class='no_history-record-list'>No history record</p>")
                }


            }
            if(pages==1)
            {
                $.cookie("countpage",Math.ceil(req[0]["count"]/30));
            }

        },
        error:function (req) {
            page.instance("queryerr");
        }
    });

}
// 获取聊天记录结束


// 添加好友


    var addFriends = function (to) {

        conn.subscribe({
            to: to,
            // Demo里面接收方没有展现出来这个message，在status字段里面
            message: 'Add a friend!'
        });

    };


// 添加好友結束

//刪除好友
    var removeFriends = function (to) {
        conn.removeRoster({
            to:to,
            success: function () {  // 删除成功
                conn.unsubscribed({
                    to: to
                });
            },
            error: function () {    // 删除失败
            }
        });
    };
// 刪除好友結束

    // 同意添加好友
    function agreeAddFriend (from) {
        conn.subscribed({
            to: from,
            message: "[resp:true]"
        });
        // 需要反向添加对方好友

        $(".chat-div-main-top").html('<div class="chat-list-div  chat-'+from+'"><img src="images/portrait.jpg" class="chat-portrait" alt=""><p class="chat-username">'+from+'</p><p class="recent-message"></p></div>'+$(".chat-div-main-top").html());

    }

    //拒絕添加好友
    function refuseAddFriend(from) {
        conn.unsubscribed({
            to: from,
            message: "rejectAddFriend"                  // 拒绝添加好友回复信息
        });
    }

// 单聊发送图片消息
var sendPrivateImg = function () {
    var id = conn.getUniqueId();                   // 生成本地消息id
    var msg = new WebIM.message('img', id);        // 创建图片消息
    var input = document.getElementById('image');  // 选择图片的input
    var file = WebIM.utils.getFileUrl(input);      // 将图片转化为二进制文件
    var to=$(".select-id").find(".chat-username").html();
    var allowType = {
        'jpg': true,
        'gif': true,
        'png': true,
        'bmp': true
    };
    if (file.filetype.toLowerCase() in allowType) {
        var option = {
            apiUrl: WebIM.config.apiURL,
            file: file,
            to: to,                       // 接收消息对象
            roomType: false,
            chatType: 'singleChat',
            onFileUploadError: function () {      // 消息上传失败
                console.log('onFileUploadError');
            },
            onFileUploadComplete: function (req) {   // 消息上传成功
                console.log(msg.body.body.url);
            },
            success: function () {                // 消息发送成功
                $.ajax({ url: "../chat",
                    type:'post',
                    data: {
                        'from':$.cookie("username"),
                        "to":to,
                        "message":msg.body.body.url,
                        "type":2,
                        "key":'web'
                    },
                    success: function(req){
                        
                        var img="<img class='send-img' src='"+msg.body.body.url+"'>";
                        addSendMessage(img,2);
                        if(req==1)
                        {

                        }
                        else{
                            page.instance('error')
                        }
                        
                    },
                    error:function () {
                        page.instance('error')
                    }
                });
                // end ajax
            },
            flashUpload: WebIM.flashUpload
        };
        msg.set(option);
        conn.send(msg.body);
    }
    else
    {
        page.instance("uploaderr");
        //上传的文件格式不支持

    }
};
//單聊發送圖片消息 End


// 单聊发送文件消息
var sendPrivateFile = function () {
    var id = conn.getUniqueId();                   // 生成本地消息id
    var msg = new WebIM.message('file', id);        // 创建文件消息
    var input = document.getElementById('file');  // 选择文件的input
    var file = WebIM.utils.getFileUrl(input);      // 将文件转化为二进制文件
    var to=$(".select-id").find(".chat-username").html();
    var allowType = {
        'jpg': true,
        'gif': true,
        'png': true,
        'bmp': true,
        'zip': true,
        'txt': true,
        'doc': true,
        'pdf': true
};
    if (file.filetype.toLowerCase() in allowType) {
        var option = {
            apiUrl: WebIM.config.apiURL,
            file: file,
            to: to,                       // 接收消息对象
            roomType: false,
            chatType: 'singleChat',
            onFileUploadError: function () {      // 消息上传失败
                console.log('onFileUploadError');
            },
            onFileUploadComplete: function () {   // 消息上传成功
                console.log(msg);
            },
            success: function () {                // 消息发送成功
                $.ajax({ url: "../chat",
                    type:'post',
                    data: {
                        'from':$.cookie("username"),
                        "to":to,
                        "message":msg.body.body.url,
                        "type":3,
                        "key":'web'
                    },
                    success: function(req){
                        if(req==1)
                        {
                            var img="<div class='message-file-top'>File</div><div class='message-file-bottom'><img class='file_img' src='images/message_file.png' alt=''><p class='file_name'>"+msg.filename+"</p><p class='file_down_url'><a href='"+msg.body.body.url+"'>Click downland</a></p></div>";
                            addSendMessage(img,3);
                        }
                        else{
                            page.instance('error')
                        }
                        
                    },
                    error:function () {
                        page.instance('error')
                    }
                });
                // end ajax
            },
            flashUpload: WebIM.flashUpload
        };
        msg.set(option);
        conn.send(msg.body);
    }
    else
    {
        page.instance("uploaderr");
        // alert("The uploaded file format is not supported");
        //上传的文件格式不支持

    }
};
// 单聊发送文件消息结束


//html特殊字符转实体字符
function escape(html){
    var elem = document.createElement('div')
    var txt = document.createTextNode(html)
    elem.appendChild(txt)
    return elem.innerHTML;
}


//傳进去图片路径转化为base64
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
    var dataURL = canvas.toDataURL("image/"+ext);
    return dataURL;
}
var image = new Image();
image.crossOrigin = '';
image.src = img;
image.onload = function(){
    var base64 = getBase64Image(image);
    console.log(base64);
}
//傳进去图片路径转化为base64 End
