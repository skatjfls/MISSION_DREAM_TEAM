<?php
// 2024.04.11 nimo

require_once 'dbConfig.php';

session_start();

if (!isset($_SESSION['id'])) {
    // Redirect to login page
    echo json_encode(null);
    exit;
}

// Assuming you have the mission name, photo, and complete values stored in variables
$id = $_SESSION['id'];
$missionName = $_POST['missionName'];
$photo = isset($_POST['photo']) ? $_POST['photo'] : null; // Set the default image to null
$complete = $_POST['complete'];

if ($missionName == null) {
    echo "Mission name is required";
    exit();
}

// Prepare the SQL statement
$sql = "INSERT INTO missions (id, mission, photo, complete) VALUES (?, ?, ?, ?)";

// Create a prepared statement
$stmt = $db->prepare($sql);

// Bind the parameters
$stmt->bind_param("ssbi",$id ,$missionName, $photo, $complete);

// Execute the statement
$stmt->execute();

// Close the statement and connection
$stmt->close();
$db->close();

echo "Mission added successfully";
?>