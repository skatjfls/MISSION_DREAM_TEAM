<?php
// 240410 김현수 작성

// db 연결
include('index.php');

// $KeepLogIn = False;

// if($KeepLogIn){

//     $duration = 24 * 60 * 60 * 30;
//     ini_set('session.gc_maxlifetime', $duration);
//     session_set_cookie_params($duration);
//     session_start();
// }else{
//     session_start();
// }

// if(!session_id()){
//     if($KeepLogIn){

//         $duration = 24 * 60 * 60 * 30;
//         ini_set('session.gc_maxlifetime', $duration);
//         session_set_cookie_params($duration);
//         session_start();
//     }else{
//         session_start();
//     }
// }

if(!session_id()){
    session_start();
}

$_SESSION['sess'] = "cur_session";

// 프론트에서 json 형태로 쏴주는 데이터를 json_decode 하여 변환
// id, password 받아서 변수에 저장
// $_POST = json_decode(file_get_contents('php://input'), true);
$id = $_POST["id"];
$password = md5($_POST["password"]);

// 로그인 유지 추가
// $KeepLogIn = $_POST["keepLogIn"] ? True : False;

$KeepLogIn = array_key_exists("KeepLogIn", $_POST) ? $_POST["KeepLogIn"] : null;

if ($KeepLogIn !== null) {
    $KeepLogIn = filter_var($KeepLogIn, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
}

// $_SESSION['KeepLogIn'] = $KeepLogIn;

// $temp = $_POST["keepLogIn"];
// $KeepLogIn = True;

// if($temp == true){
//     $KeepLogIn = True;
// }else{
//     $KeepLogIn = False;
// }

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

    if($KeepLogIn == true){
        setcookie("c_id", $id, (time() + 3600 * 24 * 30));
        // setcookie("c_password", $password, (time()+3600*24*30), "/");
    }

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