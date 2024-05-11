<?php
require_once 'dbConfig.php';
require_once 'DefaultSetting.php';

session_start();

if (!isset($_SESSION['id'])) {
    // Redirect to login page
    echo json_encode(null);
    exit;
}

// Get the group name and penalty per point
$group_name = $_POST['group_name'];
$penalty_per_point = $_POST['penaltyperpoint'];

// Initialize the variables
$member_list = array();
$time_stemp = date('Y-m-d');
$total_point = 0;

// Get member name and total point in this group
$sql = "SELECT * FROM groupmember WHERE group_name = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("s", $group_name);
$stmt->execute();
$group_member_list = $stmt->get_result();

while($group_member = $group_member_list->fetch_assoc()){
    $total_point += $group_member['point_total'];
    $member_list[] = array(
        'id' => $group_member['id'],
        'point_total' => $group_member['point_total']
    );
}
// Convert the member list to a JSON object
$member_list = json_encode($member_list);

// Record the group point
$sql = "INSERT INTO costsettlement (group_name, total_point, time_stemp, members_point, penalty_per_point) VALUES (?, ?, ?, ?, ?)";
$stmt = $db->prepare($sql);
$stmt->bind_param("sissi", $group_name, $total_point, $time_stemp, $member_list, $penalty_per_point);
$stmt->execute();

// Update the group total point status
$sql = "UPDATE groupmember SET point_total = 0 WHERE group_name = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("s", $group_name);
$stmt->execute();

$stmt->close();
$db->close();
?>