<?php
// 240410 김현수 작성

// db 연결
 
include('index.php');

// 데이터베이스 연결 오류 처리
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}

// 아이디, 패스워드, 이름 받아와서 변수에 저장
$id = isset($_POST["id"]) ? $_POST["id"] : null;
$password = isset($_POST["password"]) ? $_POST["password"] : null;
$name = isset($_POST["name"]) ? $_POST["name"] : null;

// $id = "yoon22ㄴㅇㄹㄴㄹㄴ";
// $password = "dbstjrduf";
// $name = "윤석열";

// 아이디, 패스워드, 이름이 모두 있을 시 db에 저장하는 쿼리 작성
if ($id != null && $password != null && $name != null) {
    // 중복된 아이디 확인
    $check_query = "SELECT * FROM member WHERE id=? OR name=?";
    $stmt = $db->prepare($check_query);
    $stmt->bind_param("ss", $id, $name);
    $stmt->execute();
    $check_result = $stmt->get_result();

    if ($check_result->num_rows > 0) {
        echo json_encode("이미 존재하는 아이디 혹은 닉네임입니다"); // 이미 존재하는 아이디, 닉네임인 경우
        // echo "이미 존재하는 아이디 혹은 닉네임입니다";
        exit(); // 중복된 아이디가 확인되면 종료
    } else {
        // 패스워드를 해싱하여 저장
        $hashed_password = md5($password);
        
        // INSERT 쿼리 실행
        $sql = "INSERT INTO member (id, password, name) VALUES (?, ?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("sss", $id, $hashed_password, $name); // 세 개의 문자열 파라미터
        $stmt->execute();
        $stmt->close();
        
        // 초기 값 설정
        $point = 0;
        $sql = "INSERT INTO overall (id, date, point) VALUES (?, CURDATE(), ?)";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("si", $id, $point);
        $stmt->execute();
        $stmt->close();
        
        echo json_encode(true); // 회원가입 성공
    }
} else {
    echo json_encode(false); // 필수 필드 누락
}

// db연결 종료
$db->close();
?>
