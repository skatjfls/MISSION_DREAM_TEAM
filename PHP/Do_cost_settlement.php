<?php
 
include('index.php');

if(!session_id()){
    session_start();
}

if (!isset($_SESSION['id'])) {
    // Redirect to login page
    echo json_encode(null);
    exit;
}else{
    $user_id = $_SESSION['id'];
}

// Initialize the variables
$group_name = $_POST['group_name'];
$penalty_per_point = 0;
$member_list = array();
$total_point = 0;

// 설정된 페널티 가져오기
$sql = "SELECT PenaltyPerPoint FROM grouplist WHERE group_name = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("s", $group_name);
$stmt->execute();
$result = $stmt->get_result();
while($point = $result->fetch_assoc()){
    $penalty_per_point = $point['PenaltyPerPoint'];
}



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

// Update the group total point status
$sql = "UPDATE groupmember SET point_total = 0 WHERE group_name = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("s", $group_name);
$stmt->execute();

$group_info = array(
    "totalPoint" => $total_point,
    "memberList" => $member_list,
    "penaltyPerPoint" => $penalty_per_point
);

echo json_encode($group_info);

$stmt->close();
$db->close();
?>