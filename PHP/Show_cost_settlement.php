<?php
// 2024.04.11 nimo

// member_name, total_pont is needed
 
include('index.php');      

if(!session_id()){
    session_start();
}

if (!isset($_SESSION['id'])) {
    echo json_encode(null);
    exit;
}

$id = $_SESSION['id'];
$group_name = $_POST['group_name']; // primary key

// 그룹 내 토탈 포인트 가져오기
try{
    $sql = "SELECT point_total FROM groupmember WHERE group_name = ?";
    $stmt = $db -> prepare($sql);
    $stmt->bind_param("s", $group_name);
    $stmt->execute();
    $result = $stmt->get_result();

    $total_point = 0;

    while($row = $result->fetch_assoc()){
        $total_point += $row['point_total'];
    }

    $stmt->close();
    
}catch(exception $e){
    echo json_encode(null);
    exit;
}

echo json_encode($total_point);

?>