<?php
// 240419 김현수 작성

require_once("dbConfig.php");

session_start();

if (!isset($_SESSION['id'])) {

    // 세션이 없는 경우 로그인 페이지로 이동 또는 오류 처리
    echo json_encode(null);
    exit;
}

$id = $_SESSION["id"];

// 새로운 패스워드, 이름 받아와서 변수에 저장
$new_password = isset($_POST["new_password"]) ? md5($_POST["new_password"]) : null;
$new_name = isset($_POST["new_name"]) ? $_POST["new_name"] : null;

// 새로운 패스워드, 이름으로 변경하는 쿼리, 쿼리 실행
$query_updateInfo = "UPDATE member SET password = '$new_password', name = '$new_name' WHERE id = '$id'";
// $query_updateInfo_password = "UPDATE member SET password = $new_password WHERE id = '$id'";
// $query_updateInfo_name = "UPDATE member SET name = $new_name WHERE id = '$id'";
$db->query($query_updateInfo);

// 새로운 이름으로 세션 변경
$_SESSION["name"] = $new_name;

echo json_encode(true);

echo '\n';

echo $_SESSION["name"];

mysqli_close($db);

?>