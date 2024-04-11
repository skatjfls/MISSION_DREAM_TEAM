<?php
// 2024.04.11 nimo

// member_name, total_pont is needed
require_once 'dbConfig.php';

session_start();

if (!isset($_SESSION['id'])) {
    // Redirect to login page
    echo json_encode(null);
    exit;
}

$id = $_SESSION['id'];
$group_name = $_POST['group_name']; // primary key
$penalty_per_point = $_POST['penalty_per_point']; // or we can get the penalty per point from the group table

// Get member name and total point in this group
$sql = "SELECT member_name, total_point FROM groupmember WHERE group_name = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("s", $group_name);
$stmt->execute();
$member_list = $stmt->get_result();

if ($member_list->num_rows > 0){
    // Convert the result to an array
    $members = array();
    while ($row = $member_list->fetch_assoc()) {
        $members[] = $row;
    }

    echo json_encode($members);
}
else {
    echo "No members found";
}

$stmt->close();
$db->close();

?>