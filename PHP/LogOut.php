<?php
//240410 김현수 작성
include('index.php');
session_start();

setcookie("c_id");
unset($_SESSION['id']);
unset($_SESSION['name']);
unset($_SESSION['group']);

// 모든 세션 변수 삭제
$_SESSION = array();

// 세션 쿠기 삭제
if (ini_get("session.use_cookies")){
    $paramse = session_get_cookie_params();
    setcookie(session_name(),'',time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

session_destroy();
?>