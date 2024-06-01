<?php
 
include('index.php');

if(!session_id()){
    session_start();
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