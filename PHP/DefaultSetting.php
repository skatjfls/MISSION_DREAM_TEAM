<?php
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = (array) json_decode(file_get_contents('php://input'), true);
}
?>