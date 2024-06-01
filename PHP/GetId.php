<?php
// 240522 김현수 작성
// 사용자 아이디 가져오기
 
include('index.php');

// 세션 여부 확인
if(!session_id()){
    session_start();
}

if (!isset($_SESSION['id'])) {

    echo json_encode(array("error"=>"세션에 아이디가 존재하지 않습니다."));
    exit();
}

$id = $_SESSION['id'];

echo json_encode($id);

?>