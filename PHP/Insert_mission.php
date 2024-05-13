<?php
// 2024.04.11 nimo

require_once 'dbConfig.php';
require_once 'DefaultSetting.php';


if(!session_id()){
    session_start();
    $id = $_SESSION['id'];
}


#Assuming you have the mission name, photo, and complete values stored in variables
$mission = isset($_POST['mission']) ? $_POST['mission'] : null;

if ($mission == null) {
    echo "Mission name is required";
    exit();
}

// Prepare the SQL statement
$sql = "INSERT INTO missions (id, mission) VALUES (?, ?)";

// Create a prepared statement
$stmt = $db->prepare($sql);

// Bind the parameters
$stmt->bind_param("ss",$id ,$missionName);

// Execute the statement
$stmt->execute();

// Close the statement and connection
$stmt->close();
$db->close();

echo "Mission added successfully";
?>