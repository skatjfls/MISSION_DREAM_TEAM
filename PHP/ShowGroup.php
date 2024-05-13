<?php
// 240419 김현수 작성
require_once("dbConfig.php");
require_once("DefaultSetting.php");

if(!session_id()){
    session_start();
}

// 세션에서 아이디 받기 
$id = $_SESSION['id'];

// 사용자의 그룹을 찾는 쿼리, 실행
$query_showGroup = "SELECT group_name FROM groupmember WHERE id = '$id'";
$res = $db->query($query_showGroup);

// 연관 배열에 그룹들 저장
if($res){
    $groupList = array();

    while($row = $res->fetch_array(MYSQLI_ASSOC)){
        $groupList[] = $row;
    }
}else{
    echo json_encode(false);
}

echo json_encode($groupList);

// print_r($groupList);

mysqli_close($db);

?>
