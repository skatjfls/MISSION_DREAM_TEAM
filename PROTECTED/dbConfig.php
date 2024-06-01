<?php
//DB 연결 파일
//에러처리
error_reporting((E_ALL));
ini_set("display_errors", 1);

//json 통신
header("Content-Type:application/json");

$host = 'mission-dream-team-db.cdagy8m825d3.ap-northeast-2.rds.amazonaws.com';
$user = 'admin';
$pw = 'altusemflaxla!!';
$dbName = 'mydb';
$port = 3306;

$db = new mysqli($host, $user, $pw, $dbName, $port);


mysqli_set_charset($db, "utf8");
?>