<?php

 
include('index.php');

if(!session_id()){
    session_start();
}

if (!isset($_SESSION['id'])) {
    echo json_encode(array('error' => '로그인이 필요합니다.'));
    exit;
}else{
    $id = $_SESSION['id'];
}


$mission_idx = $_POST['mission_idx'];
// 이미지 경로 가져오기
try{
    $sql = "SELECT photo FROM missions WHERE id = ? AND mission_idx = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param('si', $id, $mission_idx);
    $stmt->execute();
    $result = $stmt->get_result();

    $photo_path = $result->fetch_assoc()['photo'];

    echo json_encode(array('photoPath' => $photo_path));

}catch(Exception $e){
    echo json_encode(array('error' => '이미지 파일 이름을 가져오는 중 오류가 발생하였습니다.'));
    exit;
}

?>