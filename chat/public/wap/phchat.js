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
        $(".main-div").load("contect_index.html",function () {
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

            var img="<img class='send-img' src='"+message["url"]+"'>";
            if(message['delay']){
                var time=UTC(message['delay']);
            }
            else
            {
                var time=getNowFormatDate();
            }

            addReceiveMessage(img,message['from'],time,2);


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


            var img="<div class='message-file-top'>File</div><div class='message-file-bottom'><img class='file_img' src='images/message_file.png' alt=''><p class='file_name'>"+message.filename+"</p><p class='file_down_url'><a href='"+message.url+"'>Click downland</a></p></div>";
            if(message['delay']){
                var time=UTC(message['delay']);
            }
            else
            {
                var time=getNowFormatDate();
            }

            addReceiveMessage(img,message['from'],time,3);




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
                $(".receiveed_add_friend").toggle();
                $(".agree-friend-name").html(message.from);
                // 拒绝对方添加好友
                break;
            case 'subscribed':                          // 对方同意添加好友，已方同意添加好友

                if($(".contect_"+message.from).length>0)
                {
                    $(".contect_"+message.from).find(".contect_name").html(message.from);
                }
                else
                {
                    var friendList=$(".contect_list").html();
                    friendList= friendList +'<div class="contect contect_'+message.from+'"> <div class="contect_logo"> <img src="images/portrait.jpg" alt=""> </div> <p class="contect_name">'+message.from+'</p></div>';
                    $(".contect_list").html(friendList);
                }

                break;
            case 'unsubscribe':                         // 对方删除好友
                $(".contect_"+message.from).remove();
                removeFriends(message.from);
                break;
            case 'unsubscribed':                        // 被拒绝添加好友，或被对方删除好友成功
                $(".contect_"+message.from).remove();
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
// function register() {
//     var options = {
//         username: 'username',
//         password: 'password',
//         nickname: 'nickname',
//         appKey: WebIM.config.appkey,
//         success: function () { },
//         error: function () { },
//         apiUrl: WebIM.config.apiURL
//     };
//     conn.registerUser(options);
// }
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

// //註冊結束

//    登錄開始

function login(user,pass) {

    if($.cookie('username')!=null && $.cookie('username')!='null')
    {

        var options = {
            apiUrl: WebIM.config.apiURL,
            user: user,
            pwd: pass,
            appKey: WebIM.config.appkey,
            success: function (token) {
                // alert(token);
                $.cookie("username",user);
                $.cookie("webim_"+token.user.username,token.access_token);


                // alert($.cookie('webim_' + encryptUsername));
            },
            error: function(){
            }
        };

        conn.open(options);
    }
    else
    {


        var options = {
            apiUrl: WebIM.config.apiURL,
            user: user,
            pwd: pass,
            appKey: WebIM.config.appkey,
            success: function (token) {
                // alert(token);
                $.cookie("nickname",token.user.nickname);
                var token = token.access_token;
                $.cookie('webim_'+user, token);
                $.cookie("username",user);



            },
            error: function(){
                alert("ERROR Incorrect username or password");
            }
        };
        conn.open(options);

    }
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
                       alert("Send failed");
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

            var friendList=$(".contect_list").html();
            for ( var i = 0, l = roster.length; i < l; i++ ) {
                var ros = roster[i];
                //ros.subscription值为both/to为要显示的联系人，此处与APP需保持一致，才能保证两个客户端登录后的好友列表一致
                if($(".chat-list-div").hasClass("chat-"+roster[i]["name"]))
                {

                }
                else
                {
                    if ( ros.subscription === 'both' || ros.subscription === 'to' ) {

                        friendList= friendList +'<div class="contect contect_'+roster[i]["name"]+'"> <div class="contect_logo"> <img src="images/portrait.jpg" alt=""> </div> <p class="contect_name">'+roster[i]["name"]+'</p></div>';
                       // friendList= friendList +'<div class="chat-list-div  chat-'+roster[i]["name"]+'"><p class="unread"></p><img src="images/portrait.jpg" class="chat-portrait" alt=""><p class="chat-username">'+roster[i]["name"]+'</p><p class="recent-message"></p></div>';
                    }
                    if ( ros.subscription === 'none') {
                        friendList= friendList +'<div class="contect contect_'+roster[i]["name"]+'"> <div class="contect_logo"> <img src="images/portrait.jpg" alt=""> </div> <p class="contect_name">'+roster[i]["name"]+'</p><d>（Stranger）</d></div>';
                      //friendList= friendList +'<div class="chat-list-div  chat-'+roster[i]["name"]+'"><img src="images/portrait.jpg" class="chat-portrait" alt=""><p class="chat-username">'+roster[i]["name"]+'</p><p class="isNoFriend">（陌生人）</p><p class="recent-message"></p></div>';
                    }
                }

            }

            $(".contect_list").html(friendList);
            //        如果有指定的对话人则填出对应的对话框
            $.cookie("toUser","");
            var getData=getGet();
            if(getData.to!=null)
            {

                if($(".contect_list").find(".contect_"+getData.to).length>0)
                {

                }
                else
                {
                    var friendList=$(".contect_list").html();

                    friendList= friendList +'<div class="contect contect_'+getData.to+'"> <div class="contect_logo"> <img src="images/portrait.jpg" alt=""> </div> <p class="contect_name">'+getData.to+'</p><d>（Stranger）</d></div>';
                    $(".contect_list").html(friendList);
                }
                $(".contect_list").find(".contect_"+getData.to).trigger("click");
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


      //  var username=$(".select-id").find(".chat-username").html(); //找到發送給哪個用戶
        $(".chat:visible").append('<div class="one_message right"> <div class="one_message_logo"> <img src="images/portrait.jpg" alt=""> </div> <div class="one_message_right"> <div class="one_message_right_top">'+getNowFormatDate()+'</div> <div class="one_message_right_bottom">'+message+'</div> </div> </div>');
        // ↑聊天框裏面加入消息
        // ↓好友列表顯示最近的一条消息
        // 开始判断消息的类型，图片和文件显示文字就好了
        var sendUser=$(".chat:visible").find("p").eq(1).html();

        if(type==2)
        {
            $(".chat_list").find("."+sendUser).find(".contect_zuijin").html("[ Picture ]");
        }
        else if(type==3)
        {
            $(".chat_list").find("."+sendUser).find(".contect_zuijin").html("[ File ]");
        }
        else
        {
            $(".chat_list").find("."+sendUser).find(".contect_zuijin").html(message);

        }


        // ↓滚动到最下
    // alert( $(".chat:visible").height);
    $(".chat:visible").scrollTop( 9999999);




}
function addReceiveMessage(message,from,time) {
    var message = arguments[0] ? arguments[0] : message;
    var from = arguments[1] ? arguments[1] : 'admin';
    var time = arguments[2] ? arguments[2] : getNowFormatDate();
    var type = arguments[3] ? arguments[3] : 0;


    if($("."+from).parent(".chat_list").length > 0 ||$(".chat_list").find("."+from).length>0){
        var str=$(".chat_list").find("."+from).prop("outerHTML");
        $(".chat_list").find("."+from).remove();
        var htmlStr=$(".chat_list").html();
        htmlStr=str+htmlStr;
        $(".chat_list").html(htmlStr);
    }
    else
    {
        var htmlStr=$(".chat_list").html();
        htmlStr='<div class="chat_contect '+from+' "><p class="unread hide" style="display: block;"></p> <div class="contect_logo"> <img src="images/portrait.jpg" alt=""> </div> <div class="contect_xiangqing"> <div class="name">'+from+'</div> <div class="contect_zuijin"></div> </div> </div>'+htmlStr;
        $(".chat_list").html(htmlStr);
    }
    if($("."+from).parent(".chat_page").length > 0){

    }
    else
    {
        var chatStr=$(".chat_page").html();
        chatStr='<div class="chat '+from+'"><div class="top"> <p class="left"><svg t="1502784354454" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="997" xmlns:xlink="http://www.w3.org/1999/xlink" ><defs><style type="text/css"></style></defs><path d="M1013 448.4 247.6 448.4 607.2 93.2l-88.2-88L11 511.8 520 1018.8l86.6-87.2L247.8 571.2l765.2 0L1013 448.4z" p-id="998" fill="#ffffff"></path></svg></p> <p>'+from+'</p> <p class="info_rights" style="float: right"><svg t="1503034416461" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4726" xmlns:xlink="http://www.w3.org/1999/xlink" ><defs><style type="text/css"></style></defs><path d="M511.999983 76.493794c125.754386 0 228.325886 102.583663 228.325886 228.338049 0 125.766549-102.5715 228.338049-228.325886 228.338049-125.742223 0-228.338049-102.5715-228.338049-228.338049C283.661934 179.077457 386.25776 76.493794 511.999983 76.493794z" p-id="4727" fill="#ffffff"></path><path d="M906.291494 948.22383 117.708472 948.22383c7.249213-186.533443 180.987065-335.823445 394.291511-335.823445S899.054444 761.690387 906.291494 948.22383z" p-id="4728" fill="#ffffff"></path></svg></p></div> <div class="top_zhe"></div> </div>'+chatStr;
        $(".chat_page").html(chatStr);
    }


    //添加联系人和聊天界面



        if(type==2)
        {
            $(".chat_page").find("."+from).append('<div class="one_message"> <div class="one_message_logo"> <img src="images/portrait.jpg" alt=""> </div> <div class="one_message_right"> <div class="one_message_right_top">'+getNowFormatDate()+'</div> <div class="one_message_right_bottom">'+message+'</div> </div> </div>');
            $(".chat_list").find("."+from).find(".contect_zuijin").html("[ picture ]");
            $(".chat_list").find("."+from).find(".unread").show();
        }
        else if(type==3)
        {
            $(".chat_page").find("."+from).append('<div class="one_message"> <div class="one_message_logo"> <img src="images/portrait.jpg" alt=""> </div> <div class="one_message_right"> <div class="one_message_right_top">'+getNowFormatDate()+'</div> <div class="one_message_right_bottom">'+message+'</div> </div> </div>');

            $(".chat_list").find("."+from).find(".contect_zuijin").html("[ file ]");
            $(".chat_list").find("."+from).find(".unread").show();
        }
        else if(type==4)
        {
            $(".chat_page").find("."+from).append('<div class="one_message"> <div class="one_message_logo"> <img src="images/portrait.jpg" alt=""> </div> <div class="one_message_right"> <div class="one_message_right_top">'+getNowFormatDate()+'</div> <div class="one_message_right_bottom">'+message+'</div> </div> </div>');
            $(".chat_list").find("."+from).find(".contect_zuijin").html("[ audio ]");
            $(".chat_list").find("."+from).find(".unread").show();
        }
        else
        {

            $(".chat_page").find("."+from).append('<div class="one_message"> <div class="one_message_logo"> <img src="images/portrait.jpg" alt=""> </div> <div class="one_message_right"> <div class="one_message_right_top">'+getNowFormatDate()+'</div> <div class="one_message_right_bottom">'+message+'</div> </div> </div>');
            $(".chat_list").find("."+from).find(".contect_zuijin").html(message);
            $(".chat_list").find("."+from).find(".unread").show();

        }


        // 消息提示处理End

        // alert( $(".chat-"+from).prop("outerHTML"));
    $(".chat_page").find("."+from).scrollTop( 9999 );



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
function gethistory(peopleone,peopletwo,page) {
    $.ajax({ url: "../chat/query",
        type:'post',
        data: {
            'peopleone':peopleone,
            "peopletwo":peopletwo,
            "page":page
        },
        dataType: "json",
        success: function(req){
            $(".history_record_div").html("");
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
                    $(".history_record_div").append('<p class="history-record-from">'+req[i]["from"]+'</p><p class="history-record-time">'+req[i]["time"]+'</p> <p class="history-record-message">'+allMessages+'</p>');
                }
                else
                {
                    $(".history_record_div").append("<p class='no_history-record-list'>No history record</p>")
                }
            }
            if(page==1)
            {
                $.cookie("countpage",Math.ceil(req[0]["count"]/30));
            }
        },
        error:function (req) {
            console.log(req);
            alert("Query failed");
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
        // if($("ss"))/
        if($(".contect_"+from).length>0)
        {
            $(".contect_"+from).find(".contect_name").html(from);
        }
        else
        {
            var friendList=$(".contect_list").html();
            friendList= friendList +'<div class="contect contect_'+from+'"> <div class="contect_logo"> <img src="images/portrait.jpg" alt=""> </div> <p class="contect_name">'+from+'</p></div>';
            $(".contect_list").html(friendList);
        }
       // $(".chat-div-main-top").html('<div class="chat-list-div  chat-'+from+'"><img src="images/portrait.jpg" class="chat-portrait" alt=""><p class="chat-username">'+from+'</p><p class="recent-message"></p></div>'+$(".chat-div-main-top").html());

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
    var to=$(".chat:visible").find("p").eq(1).html();
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
                    },
                    error:function () {
                        alert("發送失敗");
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
        alert("The uploaded file format is not supported")
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
    var to=$(".chat:visible").find("p").eq(1).html();
    var allowType = {
        'jpg': true,
        'gif': true,
        'png': true,
        'bmp': true,
        'zip': true,
        'txt': true,
        'doc': true,
        'pdf': true,
        'php':true
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
                        var img="<div class='message-file-top'>File</div><div class='message-file-bottom'><img class='file_img' src='images/message_file.png' alt=''><p class='file_name'>"+msg.filename+"</p><p class='file_down_url'><a href='"+msg.body.body.url+"'>Click downland</a></p></div>";
                        addSendMessage(img,3);
                    },
                    error:function () {
                        alert("發送失敗");
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
        alert("The uploaded file format is not supported");
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



