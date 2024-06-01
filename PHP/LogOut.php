<?php
//240410 김현수 작성
include('index.php');
session_start();

unset($_SESSION['id']);
unset($_SESSION['name']);
unset($_SESSION['group']);

session_destroy();
?>