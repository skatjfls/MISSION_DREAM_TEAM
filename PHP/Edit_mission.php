<?php
// 2024.04.11 nimo

 
include('index.php');

if(!session_id()){
    session_start();
}

if (!isset($_SESSION['id'])) {
    // Redirect to login page
    echo json_encode("ID not found");
    exit;
}

// Assuming you have the mission ID, name, photo, and check values stored in variables
$id = $_SESSION['id'];
$mission_idx = $_POST['mission_idx'];

// Assuming you have the mission name, photo, and check values stored in variables
$missionName = isset($_POST['missionName']) ? $_POST['missionName'] : null;
$photo = isset($_POST['photo']) ? $_POST['photo'] : null;
$complete = isset($_POST['complete']) ? $_POST['complete'] : null;

// Check if the mission name, photo, and check values are null
if ($missionName == null) {
    $missionNmae = $_POST['missionName'];
}

if ($photo == null) {
    $photo = $_POST['photo'];
}

if ($check == null) {
    $complete = $_POST['complete'];
}

// Prepare the SQL statement
$sql = "UPDATE missions SET mission = ?, photo = ?, complete = ? WHERE id = ? AND mission_idx = ?";

// Create a prepared statement
$stmt = $db->prepare($sql);

// Bind the parameters
$stmt->bind_param("sbii", $missionName, $photo, $complete, $id, $mission_idx);

// Execute the statement
$stmt->execute();

// Close the statement and connection
$stmt->close();
$db->close();

?>