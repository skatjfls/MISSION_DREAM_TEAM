<?php
// 240521 김현수 작성

 
include('index.php');

// 세션 여부 확인
if(!session_id()){
    session_start();
}

if (!isset($_SESSION['id'])) {

    // 세션이 없는 경우 로그인 페이지로 이동 또는 오류 처리
    echo json_encode(False);
    exit();
}

$id = $_SESSION['id'];

// 사용자의 미션 수행 기록 
$query = "SELECT date, point FROM overall WHERE id = '$id'";
$res = $db->query($query);

$data = array();

while($row = $res->fetch_array(MYSQLI_ASSOC)){
    $data[] = $row;
}

echo json_encode($data);

// echo json_encode($data[0]['date']);
// print_r($data);

// echo "\n";

mysqli_close($db);

?>