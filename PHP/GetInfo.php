<?php
// 240511 김현수 작성
 
include('index.php');

// 세션 여부 확인
if(!session_id()){
    session_start();
}

$user_id = $_SESSION['id'];

try{
    // 사용자 이름 찾아서 반환
    $query_name = "SELECT name FROM member WHERE id = '$user_id'"; 
    $res = $db->query($query_name);
    $row = $res->fetch_assoc();
    $user_name = $row['name'];

    if ($user_name == null) {
        $user_name = 'Unknown';
    }

//     // 사용자 포인트 찾아서 반환
//     $query_point = "SELECT point FROM overall WHERE id = '$user_id'";
//     $res = $db->query($query_point);
//     $row = $res->fetch_assoc();
//     $user_point = $row['point'];

//     if( $user_point == null){
//         $user_point = -9999999;
//     }

}catch(Exception $e){
    $user_name = 'Unknown';
}

try{
    $sql = 'SELECT mission FROM missions WHERE id = ? AND complete = 0';
    $stmt = $db->prepare($sql);
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $sql_mission = $stmt->get_result();
    $no_complete_mission = array();
    while($row = $sql_mission->fetch_assoc()){
        array_push($no_complete_mission, array_values($row));
    }
    $no_complete_mission_cnt = count($no_complete_mission);
    
}catch(Exception $e){
    $no_complete_mission_cnt = -9999999;
}finally{
    if($stmt != null){
        $stmt->close();
    }
}

// 전체 미션 수를 반환하는 코드 추가 ( 김현수 )
try{
    $sql = 'SELECT mission FROM missions WHERE id = ?';
    $stmt = $db->prepare($sql);
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $sql_mission = $stmt->get_result();
    $totalMission = array();
    while($row = $sql_mission->fetch_assoc()){
        array_push($totalMission, array_values($row));
    }
    $totalMissionCnt = count($totalMission);
    
}catch(Exception $e){
    $totalMissionCnt = -9999999;
}finally{
    if($stmt != null){
        $stmt->close();
    }
}

try{
    // 그룹 리스트 찾기 
    $sql = "SELECT group_name FROM groupmember WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $sql_group_list = $stmt->get_result();

    $group_list = array();
    while($row = $sql_group_list->fetch_assoc()){
        array_push($group_list, array_values($row));
    }
}catch(Exception $e){
    $group_list = array();
}finally{
    if($stmt != null){
        $stmt->close();
    }
}

$data = array(
    'name' => $user_name,
    'noMissionCnt' => $no_complete_mission_cnt,
    'totalMissionCnt' => $totalMissionCnt,
    'group_list' => $group_list,
);

echo json_encode($data);

if($db != null){
        $db->close();
}

// echo json_encode(array('name' => $name, 'point' => $point));

?>