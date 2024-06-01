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

// 이미지 경로 가져오기
try{
    $sql = "SELECT profileImage FROM member WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param('s', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    $profile_path = $result->fetch_assoc()['profileImage'];

    if($profile_path == null){
        $profile_path = "/img/default_profile.png";
    }

    echo json_encode(array('profilePath' => $profile_path));

}catch(Exception $e){
    echo json_encode(array('error' => '이미지 파일 이름을 가져오는 중 오류가 발생하였습니다.'));
    exit;
}

?>