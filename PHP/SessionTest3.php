<?php

include('index.php');
header("Content-Type: application/json");

session_start();

echo "현재 세션은...";
echo "\n";
echo var_dump($_SESSION);
echo "\n";

?>
