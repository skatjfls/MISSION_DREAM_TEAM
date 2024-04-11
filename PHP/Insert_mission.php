<?php
// 2024.04.11 nimo

require_once 'dbConfig.php';

session_start();

if (!isset($_SESSION['id'])) {
    // Redirect to login page
    echo json_encode(null);
    exit;
}

// Assuming you have the mission name, photo, and check values stored in variables
$id = $_SESSION['id'];
$missionName = $_POST['missionName'];
$photo = null; // Set the default image to null
$check = false;

if ($missionName == null) {
    echo "Mission name is required";
    exit();
}


// Prepare the SQL statement
$sql = "INSERT INTO missions (id, mission, photo, check) VALUES (?, ?, ?, ?)";

// Create a prepared statement
$stmt = $db->prepare($sql);

// Bind the parameters
$stmt->bind_param("ssbi",$id ,$missionName, $photo, $check);

// Execute the statement
$stmt->execute();

// Close the statement and connection
$stmt->close();
$db->close();

?>