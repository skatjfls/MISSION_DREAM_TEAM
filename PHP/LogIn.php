<?php
// 240410 김현수 작성

// db 연결
ini_set("session.cookie_domain", '.dev.local');
session_set_cookie_params(3600, '/', '.dev.local');
require_once "dbConfig.php";
require_once 'DefaultSetting.php';

if(!isset($_SESSION)) {
    session_start();
 }

$_SESSION['sess'] = "cur_session";

// 프론트에서 json 형태로 쏴주는 데이터를 json_decode 하여 변환
// id, password 받아서 변수에 저장
$_POST = json_decode(file_get_contents('php://input'), true);
$id = $_POST["id"];
$password = md5($_POST["password"]);

// member 테이블에서 이용자 찾아서 member 연관 배열에 저장
$query_findMember = "SELECT * FROM member WHERE id = '$id' AND password = '$password'";
$res_member = $db->query($query_findMember);
$row_member = $res_member->fetch_array(MYSQLI_ASSOC);

// group_member 테이블에서 이용자가 속한 그룹 찾고, 있으면 $groupList 배열에 저장
$query_findGroup = "SELECT group_name FROM groupmember WHERE id = '$id'";
$res_group = $db->query($query_findGroup);

if($res_group){
    $groupList = array();

    while($row = $res_group->fetch_array(MYSQLI_ASSOC)){
        $groupList[] = $row;
    }
}

if($row_member){

    //세션에 아이디, 이름 저장
    $_SESSION['id'] = $id;
    $_SESSION['name'] = $row_member['name'];
    session_write_close();

    echo json_encode(true);


}else{
    echo json_encode(false);
}

mysqli_close($db);

?>

