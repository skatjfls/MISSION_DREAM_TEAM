<?php
// 240410 김현수 작성

 
include('index.php');

session_start();

// 세션 여부 확인
if (!isset($_SESSION['id'])) {

    // 세션이 없는 경우 로그인 페이지로 이동 또는 오류 처리
    echo json_encode(False);
    exit;
}

// 세션에서 아이디 받기, 클라에서 보내준 json형태의 자료 변환
$id = $_SESSION['id'];
$_POST = json_decode(file_get_contents('php://input'), true);

// 그룹이름, 그룹 패스워드, 그룹 공지사항, 포인트 당 벌금 받아서 변수에 저장
$group_name = $_POST["group_name"];

// 그룹이름 중복 확인



$group_password = $_POST["group_password"];
$group_notice = $_POST["group_notice"];
$penaltyPerPoint = $_POST["penaltyPerPoint"];

// 그룹을 생성하는 쿼리
$query_createGroup = "INSERT INTO grouplist VALUES('$group_name', '$group_password', '$group_notice', '$penaltyPerPoint')";
$db->query($query_createGroup);

// 그룹에 입장하는 쿼리 ( 첫생성에 자동 입장 )
$query_enterGroup = "INSERT INTO groupmember(group_name, id, point_total) VALUES('$group_name', '$id', 0)";
$db->query($query_enterGroup);

echo json_encode(true);

// echo "그룹명 : ", $group_name, "\n";
// echo "그룹 비밀번호 : ", $group_password, "\n";
// echo "그룹 공지: ", $group_notice, "\n";
// echo "그룹 내 감점 당 벌금 : ", $penaltyPerPoint, "\n";

// db 연결 종료
mysqli_close($db);
?>