<?php
/**
 * Created by PhpStorm.
 * User: LinMin
 * Date: 2017/5/10
 * Time: 下午 2:01
 */
header("Content-Type: text/html;charset=utf-8");
$mysql_server_name='localhost'; //改成自己的mysql数据库服务器

$mysql_username='root'; //改成自己的mysql数据库用户名

$mysql_password='root'; //改成自己的mysql数据库密码

$mysql_database='chat'; //改成自己的mysql数据库名





$conn=mysqli_connect($mysql_server_name,$mysql_username,$mysql_password) or die("error connecting") ; //连接数据库
mysqli_query($conn,"set names 'utf8'"); //数据库输出编码 应该与你的数据库编码保持一致.南昌网站建设公司百恒网络PHP工程师建议用UTF-8 国际标准编码.

mysqli_select_db($conn,$mysql_database); //打开数据库

if($_GET['action']=="query")
{
    $start=($_POST['page']-1)*30;
    $end=$_POST['page']*30;


    $sql ="SELECT * 
FROM  `jilu` 
WHERE (
`from` ='".$_POST['peopleone']."'
AND  `to` ='".$_POST['peopletwo']."'
)
OR (
`from` ='".$_POST['peopletwo']."'
AND  `to` ='".$_POST['peopleone']."'
)
ORDER BY  `jilu`.`time` DESC 
LIMIT ".$start." , ".$end;
 //SQL语句
    $result = mysqli_query($conn,$sql); //查询

    $data = array();

    $result->data_seek(0); #重置指针到起始
    while($row = $result->fetch_assoc())
    {
        $row['time']=date('Y-m-d H:i:s', $row['time']+3600*8);
        $data[] = $row;
    }

//    第一頁的時候查總的有多少頁
    if($_POST['page']==1)
    {
        $countSql ="SELECT count(*) as count 
FROM  `jilu` 
WHERE (
`from` ='".$_POST['peopleone']."'
AND  `to` ='".$_POST['peopletwo']."'
)
OR (
`from` ='".$_POST['peopletwo']."'
AND  `to` ='".$_POST['peopleone']."'
)";

        $result = mysqli_query($conn,$countSql); //查询
        $row = $result->fetch_assoc();
        $data[0]["count"]=$row["count"];
    }
//        第一頁的時候查總的有多少頁結束
    echo json_encode($data);
    mysqli_free_result($result);
}
else
{

    $sql ="INSERT INTO  `chat`.`jilu` (
`id` ,
`from` ,
`to` ,
`time` ,
`message` ,
`type` ,
`key`
)
VALUES (
NULL ,  '".$_POST['from']."',  '".$_POST['to']."',  '".time()."',  '".$_POST['message']."',  '".$_POST['type']."',  '".$_POST['key']."'
);
"; //SQL语句

    $result = mysqli_query($conn,$sql); //查询
}


mysqli_close($conn); //关闭MySQL连接