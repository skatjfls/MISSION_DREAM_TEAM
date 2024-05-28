<?php

 
include('index.php');

$query = "SELECT COUNT(*) FROM member";
$res = $db->query($query);

$total = 0;

if ($res) {
    if($row = $res->fetch_row()){
        $total = $row[0]; 
    }

    echo json_encode($total);

} else {
    echo json_encode(false);
}

?>