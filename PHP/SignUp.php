 <?php
// 240410 김현수 작성

// db 연결
require_once("dbConfig.php");
require_once("DefaultSetting.php");

//아이디, 패스워드, 이름 받아와서 변수에 저장
$id = isset($_POST["id"]) ? $_POST["id"] : null;
$password = isset($_POST["password"]) ? md5($_POST["password"]) : null;
$name = isset($_POST["name"]) ? $_POST["name"] : null;

// 아이디, 패스워드, 이름이 모두 있을 시 db에 저장하는 쿼리 작성
if($id != null && $password != null && $name != null){
    $sql = "INSERT INTO member VALUES('$id', '$password', '$name')";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $stmt->close();
    // db에 쿼리 실행
    
    // 초기 값 설정
    $point = 0;
    $sql = "INSERT INTO overall (id, point) VALUES ( ?,?)";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("si", $id, $point);
    $stmt->execute();
    $stmt->close();
    
}else{
    echo json_encode(false);
}

// db연결 종료
mysqli_close($db);
?>