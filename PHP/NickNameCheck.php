<?php
// 240516 김현수 작성

 
include('index.php');

// 클라에서 보내준 json형태의 자료 변환
$nickName = $_POST["nickName"];
// $nickName = "윤석열";

$query = "SELECT name FROM member WHERE name ='$nickName'";
$res = $db->query($query);
$row = $res->fetch_row();

// nickName이 db에 존재하면 id를 채우고 아니면 null
if ($row) {
    $check = $row[0];
} else {
    $check = null;
}

// nickName이 존재하면 true 반환 아니면 false 반환
if ($check) {

    echo json_encode(True);

} else {

    echo json_encode(False);
}

?>

