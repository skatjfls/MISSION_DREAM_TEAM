<?php
// 240515 김현수 작성
// 회원탈퇴.php

 
include('index.php');

if(!session_id()){
    session_start();
}

// 세션 여부 확인
if (!isset($_SESSION['id'])) {

    // 세션이 없는 경우 로그인 페이지로 이동 또는 오류 처리
    echo json_encode(false);
    exit;
}

$id = $_SESSION['id'];
// $id = "gustn123";

$quey = "DELETE FROM member WHERE id = '$id'";
$db->query($quey);

unset($_SESSION['id']);
session_destroy();

echo json_encode(true);

mysqli_close($db);

?>