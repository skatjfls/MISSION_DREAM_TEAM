<?php

include('index.php');

if(!session_id()){
    session_start();
}

if (isset($_COOKIE['c_id'])) {
    $_SESSION['id'] = $_COOKIE['c_id'];
}

echo json_encode(true);

?>