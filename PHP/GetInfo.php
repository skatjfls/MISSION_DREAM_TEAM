<?php
// 240511 김현수 작성
require_once 'dbConfig.php';
require_once 'DefaultSetting.php';

session_start();

// 세션 여부 확인
if (!isset($_SESSION['id'])) {

    // 세션이 없는 경우 로그인 페이지로 이동 또는 오류 처리
    echo json_encode(false);
    exit;
}

$id = $_SESSION['id'];

// 사용자 이름 찾아서 반환
$query_name = "SELECT name FROM member WHERE id = '$id'"; 
$res = $db->query($query_name);
$row = $res->fetch_assoc();
$name = $row['name'];

// 사용자 포인트 찾아서 반환
$query_point = "SELECT point FROM overall WHERE id = '$id'";
$res = $db->query($query_point);

if($res){
    if($row = $res->fetch_assoc()){
        $point = $row['point'];
    }
}else{
    $point = 0;
}

echo json_encode(array('name' => $name, 'point' => $point));

mysqli_close($db);

?>