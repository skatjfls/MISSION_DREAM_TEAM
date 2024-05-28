<?php
// 240419 김현수 작성

 
include('index.php');

if(!session_id()){
    session_start();
}

if (!isset($_SESSION['id'])) {

    // 세션이 없는 경우 로그인 페이지로 이동 또는 오류 처리
    echo json_encode(False);
    exit;
}

// 기존 패스워드, 새로운 패스워드, 이름 받아와서 변수에 저장
$id = $_SESSION["id"];
$newName = isset($_POST["newName"]) ? $_POST["newName"] : null;
$CurPassword = isset($_POST["CurPassword"]) ? md5($_POST["CurPassword"]) : null;
$newPassword = isset($_POST["newPassword"]) ? md5($_POST["newPassword"]) : null;

// $id = "joekok";
// $newName = "조국";
// $CurPassword = md5("whrnr123456789@@");
// $newPassword = md5("whrnr123456789@");

// DB에 현재 사용자의 비밀번호 대조
$query = "SELECT id FROM member WHERE id = '$id' AND password = '$CurPassword'";
$res = $db->query($query);
$row = $res->fetch_row();

// 사용자의 현재 비밀번호 확인
if (!$row) {
    // echo "현재 비밀번호가 일치하지 않습니다.";
    echo json_encode(array("error"=>"현재 비밀번호가 일치하지 않습니다."));
    exit();
}

if(!$newName){
    // echo "닉네임이 존재하지 않습니다.";
    echo json_encode(array("error"=>"닉네임이 존재하지 않습니다."));
    exit();
}

// 새비밀번호가 존재할 경우 비밀번호까지 변경, 아닐 경우 닉네임만 변경
if(!$newPassword){
    $query = "UPDATE member SET name = '$newName' WHERE id = '$id'";
    $db->query($query);

    // 새로운 이름으로 세션 변경
    $_SESSION["name"] = $newName;

}else{
    $query = "UPDATE member SET name = '$newName', password = '$newPassword' WHERE id = '$id'";
    $db->query($query);

    // 비밀번호 변경으로 세션 박살!
    unset($_SESSION['id']);
    session_destroy();
}

echo json_encode(true);

mysqli_close($db);

?>