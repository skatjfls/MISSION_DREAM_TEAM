<?php
// 240511 김현수 작성
require_once 'dbConfig.php';
require_once 'DefaultSetting.php';

// 세션 여부 확인
if(!session_id()){
    session_start();
}

$id = $_SESSION['id'];

// 사용자 이름 찾아서 반환
$query_name = "SELECT name FROM member WHERE id = '$id'"; 
$res = $db->query($query_name);
$row = $res->fetch_assoc();
$user_name = $row['name'];

// 사용자 포인트 찾아서 반환
$query_point = "SELECT point FROM overall WHERE id = '$id'";
$res = $db->query($query_point);
$row = $res->fetch_assoc();
$user_point = $row['point'];

// 그룹 리스트 찾기 
$sql = "SELECT group_name FROM groupmember WHERE id = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("s", $id);
$stmt->execute();
$sql_group_list = $stmt->get_result();

$group_list = array();
while($row = $sql_group_list->fetch_assoc()){
    array_push($group_list, array_values($row));
}

$data = array(
    'name' => $user_name,
    'point' => $user_point,
    'group_list' => $group_list,
);

echo json_encode($data);

// echo json_encode(array('name' => $name, 'point' => $point));

mysqli_close($db);

?>