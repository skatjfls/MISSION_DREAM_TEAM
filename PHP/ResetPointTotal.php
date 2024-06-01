<?php
// 240521 김현수 작성
// 그룹 포인트에 해당하는 GroupMember의 point_total 초기화( 그룹 멤버 전부 )
 
include('index.php');

if(!session_id()){
    session_start();
}

if (!isset($_SESSION['id'])) {

    // 세션이 없는 경우 로그인 페이지로 이동 또는 오류 처리
    echo json_encode(False);
    exit();
}

// 본인의 그룹 받아오기
$groupName = $_POST['groupName'];
// $groupName = "더불어민주당";

// 그룹 없을 경우 오류
if($groupName == null){
    echo "그룹이 존재하지 않습니다";
    echo json_encode(False);
    exit();
}

// 그룹에 해당하는 멤버의 포인트 0으로 초기화
$query = "UPDATE groupmember SET point_total = 0 WHERE group_name = '$groupName'";
$db->query($query);

echo json_encode(true);

mysqli_close($db);

?>




