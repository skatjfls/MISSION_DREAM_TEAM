<?php
// 240419 김현수 작성

 
include('index.php');
if(!session_id()){
    session_start();
}
// 세션 여부 확인
if (!isset($_SESSION['id'])) {

    // 세션이 없는 경우 로그인 페이지로 이동 또는 오류 처리
    echo json_encode(null);
    exit;
}

// 세션에서 아이디 받기
$id = $_SESSION['id'];

// 그룹 명과 그룹 패스워드 받기, 없으면 null
$group_name = isset($_POST["group_name"]) ? $_POST["group_name"] : null;
$group_password = isset($_POST["group_password"]) ? $_POST["group_password"] : null;

// 그룹 리스트 테이블에서 해당 그룹 명의 패스워드 가져오기
$query_findPassword = "SELECT group_password FROM grouplist WHERE group_name = '$group_name'";
$res_findPassword = $db->query($query_findPassword);
$row = $res_findPassword->fetch_assoc();
$findPassword = $row['group_password'];

// 가져온 패스워드와 입력한 패스워드 비교, 입력한 그룹명, 그룹 패스워드가 없으면 오류
if($group_password == $findPassword && isset($group_name) && isset($group_password)){

    $query_enterGroup = "INSERT INTO groupmember(group_name, id, point_total) VALUES('$group_name', '$id', 0)";
    $db->query($query_enterGroup);

    echo json_encode(true);

}else{
    echo json_encode(false);
}

mysqli_close($db);

?>