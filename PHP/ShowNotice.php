<?php
// 240515 김현수 작성

 
include('index.php');

$groupName = $_POST["groupName"];
// $groupName = "더불어민주당";

$query = "SELECT group_notice FROM grouplist WHERE group_name ='$groupName'";
$res = $db->query($query);
$row = $res->fetch_array(MYSQLI_ASSOC);

// 그룹 공지사항 반환
if ($row) {
    echo json_encode($row['group_notice']);
    // echo $row['group_notice'];
} else {
    echo json_encode(False);
}

?>

