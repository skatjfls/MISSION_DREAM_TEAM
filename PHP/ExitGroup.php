<?php
// 240419 김현수 작성

//여기

include('index.php');

if(!session_id()){
    session_start();
}

// 세션 여부 확인
if (!isset($_SESSION['id'])) {

    // 세션이 없는 경우 로그인 페이지로 이동 또는 오류 처리
    echo json_encode(false);
    exit;
}

// 세션에서 아이디 받기, 클라에서 보내준 json형태의 자료 변환
$id = $_SESSION['id'];

// 여기
// 그룹 이름 받아오기
$group_name = isset($_POST["groupName"]) ? $_POST["groupName"] : null;

// 그룹이 존재하지 않으면 오류
if(!$group_name){

    echo json_encode(false);
}

// 해당 그룹 멤버 테이블에서 본인 삭제하는 쿼리 작성, 실행
$quey_exitGroup = "DELETE FROM groupmember WHERE id = '$id' AND group_name = '$group_name'";
$db->query($quey_exitGroup);

// 그룹에 아무도 없을 경우 그룹 삭제 추가 240527 김현수
$query = "SELECT count(*) FROM groupmember WHERE '$group_name'";
$res = $db->query($query);

if($res){
    $row = $res->fetch_row();

    if($row[0] == 0){
        $query = "DELETE FROM grouplist WHERE group_name = '$group_name'";
        $db->query($query);

    }
}

echo json_encode(true);

mysqli_close($db);

?>

