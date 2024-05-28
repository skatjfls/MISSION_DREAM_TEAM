<?php
// 240508 김현수 작성

 
include('index.php');

// 클라에서 보내준 json형태의 자료 변환
$_POST = json_decode(file_get_contents('php://input'), true);
$id = $_POST["id"];

$query = "SELECT id FROM member WHERE id ='$id'";
$res = $db->query($query);
$row = $res->fetch_row();

// id가 db에 존재하면 id를 채우고 아니면 null
if ($row) {
    $check = $row[0];
} else {
    $check = null;
}

// id가 존재하면 true 반환 아니면 false 반환
if ($check) {

    echo json_encode(True);

} else {

    echo json_encode(False);
}

?>

