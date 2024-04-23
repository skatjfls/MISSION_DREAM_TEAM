<?php

require_once("dbConfig.php");

$query = "SELECT COUNT(*) FROM member";
$res = $db->query($query);

$total = 0;

if ($res) {
    if($row = $res->fetch_row()){
        $total = $row[0]; 
    }

    echo "지금까지 ", $total, "명의 이용자가 매일 미션을 완수하고 있어요";

} else {
    echo "Query error: " . $db->error;
}

?>