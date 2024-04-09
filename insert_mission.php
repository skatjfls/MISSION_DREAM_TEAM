<?php
require_once 'dbConfig.php';

// Assuming you have the mission name, photo, and check values stored in variables
// Assuming you have the mission name, photo, and check values stored in variables
$missionName = $_POST['missionName'];
$photo = $_POST['photo'];
$check = $_POST['check'];

// Prepare the SQL statement
$sql = "INSERT INTO missions (mission, photo, check) VALUES (?, ?, ?)";

// Create a prepared statement
$stmt = $conn->prepare($sql);

// Bind the parameters
$stmt->bind_param("sbi", $missionName, $photo, $check);

// Execute the statement
$stmt->execute();

// Close the statement and connection
$stmt->close();
$conn->close();

?>