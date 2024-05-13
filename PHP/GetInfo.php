<?php
// 240511 김현수 작성
require_once 'dbConfig.php';
require_once 'DefaultSetting.php';

ini_set("session.cookie_domain", '.dev.local');
session_set_cookie_params(3600, '/', '.dev.local');

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
$user_name = $row['name'];

// 사용자 포인트 찾아서 반환
$query_point = "SELECT point FROM overall WHERE id = '$id'";
$user_point = array_values($db->query($query_point)->fetch_assoc());

// 그룹 리스트 찾기 
$sql = "SELECT group_name FROM groupmember WHERE id = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("s", $id);
$stmt->execute();
$sql_group_list = $stmt->get_result();

$group_list = array();
while($row = $sql_group_list->fetch_assoc()){
    array_push($group_list, $row);
}

// 미션 리스트 가져오기
$sql = "SELECT * FROM missions WHERE id = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("s", $id);
$stmt->execute();
$sql_mission_list = $stmt->get_result();

$mission_list = array();
while($row = $sql_mission_list->fetch_assoc()){
    array_push($mission_list, array_values($row));
}

$data = array(
    'name' => $user_name,
    'point' => $user_point,
    'group_list' => $group_list,
    'mission_list' => $mission_list
);

echo json_encode($data);

// echo json_encode(array('name' => $name, 'point' => $point));

mysqli_close($db);

?>