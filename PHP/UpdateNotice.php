<?php
//240520 김현수 작성

 
include('index.php');

$groupName = $_POST["groupName"];
$newNotice = isset($_POST["newNotice"]) ? $_POST['newNotice'] : null;

// $groupName = null;
// $newNotice = null;

if($groupName == null){
    echo "그룹이 존재하지 않습니다";
    exit();
}

if($newNotice == null){
    echo "새로운 그룹 공지사항이 필요합니다";
    exit();
}

$query = "UPDATE grouplist SET group_notice = '$newNotice' WHERE group_name = '$groupName'";
$db->query($query);


echo json_encode(true);

mysqli_close($db);

?>