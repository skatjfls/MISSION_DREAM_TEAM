<?php
//240410 김현수 작성
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
session_start();

unset($_SESSION['id']);
unset($_SESSION['name']);
unset($_SESSION['group']);

session_destroy();
?>