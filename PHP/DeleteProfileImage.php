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

        // 프로필 이미지 삭제
try{
    $sql = "SELECT profileImage FROM member WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param('s', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    while($row = $result->fetch_assoc()){
        $photo = $row['profileImage'];
        if($photo != null){
            $filePath = $photo;
            if(file_exists($filePath)){
                unlink($filePath);
            }
        }
    }
}catch(Exception $e){
    echo json_encode(array('error' => '이전 이미지 삭제 중 오류가 발생하였습니다.'));
    exit;
}

    // 프로필 이미지 경로 초기화
try{
    $sql = "UPDATE member SET profileImage = NULL WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param('s', $id);
    $stmt->execute();

}catch(Exception $e){
    echo json_encode(array('error' => '프로필 이미지 경로 초기화 중 오류가 발생하였습니다.'));
    exit;
}

// 기본프로필 이미지 경로 반환
$profile_path = "/img/default_profile.png";

echo $profile_path;


$db->close();
$stmt->close();

?>
