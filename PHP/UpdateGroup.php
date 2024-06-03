<?php
// 240603 김현수 작성

include('index.php');

if(!session_id()){
    session_start();
}

if (!isset($_SESSION['id'])) {

    // 세션이 없는 경우 로그인 페이지로 이동 또는 오류 처리
    echo json_encode(False);
    exit;
}

$groupName = isset($_POST["groupName"]) ? $_POST["groupName"] : null;
$groupPassword = isset($_POST["groupPassword"]) ? $_POST["groupPassword"] : null;
$newNotice = isset($_POST["newNotice"]) ? $_POST['newNotice'] : null;
$newPenalty = array_key_exists("Penalty", $_POST) ? $_POST['Penalty'] : null;

// $groupName = "대통령실";
// $groupPassword = "0000";
// $newNotice = "국민 모두 화이팅!";
// $newPenalty = "1000";

// 그룹 이름이 없을 시 오류
if($groupName == null){
    echo json_encode(array("error"=>"그룹 이름이 존재 하지 않습니다람쥐."));
    exit();
}

if($groupPassword == null){
    echo json_encode(array("error"=>"그룹 비밀번호 필요데스."));
    exit();
}

if($newNotice == null){
    echo json_encode(array("error"=>"새로운 공지사항이 없잖아;"));
    exit();
}

if($newPenalty === null){
    echo json_encode(array("error"=>"새로운 벌금이 없잖아;"));
    exit();
}

$query = "SELECT * FROM grouplist WHERE group_name = '$groupName' AND group_password = '$groupPassword'";
$res = $db->query($query);
$row = $res->fetch_row();

// 사용자의 현재 비밀번호 확인
if (!$row) {
    // echo "현재 비밀번호가 일치하지 않습니다.";
    echo json_encode(array("error"=>"그룹 비밀번호가 일치하지 않습니다."));
    exit();
}

$query1 = "UPDATE grouplist SET group_notice = '$newNotice' WHERE group_name = '$groupName'";
$query2 = "UPDATE grouplist SET PenaltyPerPoint = '$newPenalty' WHERE group_name = '$groupName'";

if ($db->query($query1) === TRUE && $db->query($query2) === TRUE) {
    echo json_encode(true);
} else {
    echo json_encode(false);
}
mysqli_close($db);

?>