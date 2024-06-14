<?php
// 2024.04.11 nimo

 
include('index.php');

if(!session_id()){
    session_start();
}

$missionLimit = 30;

if(!$_SESSION['id']){
    echo json_encode(array('error' => '로그인이 필요합니다.'));
    exit;
}else{
    $id = $_SESSION['id'];
}

// 미션 개수 제한
$sql = "SELECT COUNT(*) FROM missions WHERE id = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param('s', $id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$missionCount = $row['COUNT(*)'];

if($missionCount >= $missionLimit){
    echo json_encode(array('error' => '미션은 최대 30개까지만 등록 가능합니다.'));
    exit;
}

#Assuming you have the mission name, photo, and complete values stored in variables
$mission = isset($_POST['mission']) ? $_POST['mission'] : null;

if ($mission == null) {
    echo "Mission name is required";
    exit();
}

// Prepare the SQL statement
$sql = "INSERT INTO missions (id, mission, complete) VALUES (?, ?, ?)";

// Create a prepared statement
$stmt = $db->prepare($sql);
$complete = 0;

// Bind the parameters
$stmt->bind_param("ssi",$id ,$mission, $complete);

// Execute the statement
$stmt->execute();

// Close the statement and connection
$stmt->close();
$db->close();

echo "Mission added successfully";
?>