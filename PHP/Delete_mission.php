<?php
// 2024.04.11 nimo

 
include('index.php');

session_start();

if (!isset($_SESSION['id'])) {
    // Redirect to login page
    echo json_encode(array('error' => '로그인이 필요합니다.'));
    exit;
}else{
    $id = $_SESSION['id'];
}

// 현재 시간 확인
date_default_timezone_set('Asia/Seoul');
$now = date('H:i:s');

// 작동 가능 시간 설정
$start_time = "05:00:00";
$end_time = "21:00:00";

if(!($now >= $start_time && $now <= $end_time)){
    echo json_encode(array('error' => '미션 등록은 05:00 ~ 21:00 사이에만 가능합니다.'));
    exit;
}

// Assuming you have the mission id stored in a variable
$mission_idx = $_POST['mission_idx'];

// Prepare the SQL statement
$sql = "DELETE FROM missions WHERE id = ? AND mission_idx = ?";

// Create a prepared statement
$stmt = $db->prepare($sql);

// Bind the parameter
$stmt->bind_param("si", $id, $mission_idx);

// Execute the statement
$stmt->execute();

// Close the statement and connection
$stmt->close();
$db->close();

?>
