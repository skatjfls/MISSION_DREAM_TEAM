<?php
// 240419 김현수 작성
 
include('index.php');

if(!session_id()){
    session_start();
}

// 세션에서 아이디 받기 
$id = $_SESSION['id'];

// 사용자의 그룹을 찾는 쿼리, 실행
$query = "SELECT group_name FROM groupmember WHERE id = '$id'";
$res = $db->query($query);

// 연관 배열에 그룹들 저장
if($res){
    $groupList = array();

    while($row = $res->fetch_array(MYSQLI_ASSOC)){
        $groupList[] = $row;
    }
}else{
    echo json_encode(false);
}

// 벌금 배열 생성
$penalty = array();

// 뽑아온 그룹 리스트 각각에 대해 벌금을 배열에 저장
foreach($groupList as $group){

    $query = "SELECT PenaltyPerPoint FROM grouplist WHERE group_name = '".$group['group_name']."'";
    $res = $db->query($query);

    while($row = $res->fetch_array(MYSQLI_ASSOC)){
        $penalty[] = $row;
    }
}

// 그룹 멤버 내에 인원 수 저장하는 배열
$groupMemberCnt = array();

// 뽑아온 그룹 리스트 각각에 멤버 수를 배열에 저장
foreach($groupList as $group){

    $query = "SELECT count(*) FROM groupmember WHERE group_name = '".$group['group_name']."'";
    $res = $db->query($query);

    while($row = $res->fetch_array(MYSQLI_ASSOC)){
        $groupMemberCnt[] = $row['count(*)'];
    }
}

$data = array();

for ($i = 0; $i < count($groupList); $i++) {
    $data[] = array(
        'groupName' => $groupList[$i],
        'penaltyPerPoint' => $penalty[$i],
        'groupMemberCnt' => $groupMemberCnt[$i],
    );
}

// $data = array(
//     'groupList' => $groupList,
//     'penalty' => $penalty,
//     'groupMemberCnt' => $groupMemberCnt,
// );

//echo json_encode(array('groupList' => $groupList, 'penalty' => $penalty, 'groupMemberCnt' => $groupMemberCnt));
echo json_encode($data);
// echo "\n";
// print_r($data);
//echo print_r(array('groupList' => $groupList, 'penalty' => $penalty, 'groupMemberCnt' => $groupMemberCnt));

//echo json_encode(array('name' => $name, 'point' => $point));

// print_r($groupList);

mysqli_close($db);

?>
