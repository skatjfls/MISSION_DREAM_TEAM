<?php
// 240515 김현수 작성

 
include('index.php');

$groupName = $_POST["groupName"];
// $groupName = "오합지졸5인큐";

$query = "SELECT group_name FROM grouplist WHERE group_name ='$groupName'";
$res = $db->query($query);
$row = $res->fetch_row();

// 그룹명이 db에 존재하면 groupName를 채우고 아니면 null
if ($row) {
    $check = $row[0];
} else {
    $check = null;
}

// groupName이 존재하면 true 반환 아니면 false 반환
if ($check) {

    echo json_encode(False);

} else {

    echo json_encode(True);
}

?>

