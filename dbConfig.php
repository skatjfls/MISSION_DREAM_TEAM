<?php
//DB 연결 파일
//에러처리
error_reporting((E_ALL));
ini_set("display_errors", 1);

//json 통신
header("Content-Type:application/json");

$host = '127.0.0.1:3306';
$user = 'root';
$pw = '';
$dbName = 'test_db';

$db = new mysqli($host, $user, $pw, $dbName);


mysqli_set_charset($db, "utf8");