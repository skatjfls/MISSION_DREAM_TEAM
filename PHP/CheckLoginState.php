<?php

include('index.php');

if(!session_id()){
    session_start();
}

header("Refresh:0");

// $_COOKIE['c_id'] = isset($_COOKIE['c_id']) ? $_COOKIE['c_id'] : null;

// if($_COOKIE['c_id']){
//     $_SESSION['id'] = $_COOKIE['c_id'];
// }

if (isset($_COOKIE['c_id'])) {
    $_SESSION['id'] = $_COOKIE['c_id'];
}

if (!isset($_SESSION['id'])){
    // Redirect to login page
    echo json_encode(false);
    exit;
}else{
    echo json_encode(true);
    exit;
}

?>