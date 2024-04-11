<?php
require_once 'dbConfig.php';

session_start();

if (!isset($_SESSION['id'])) {
    // Redirect to login page
    echo json_encode(null);
    exit;
}

// Assuming you have the mission ID stored in a variable
$id = $_SESSION['id'];

// Assuming you have the mission idx stored in a variable
$mission_idx = $_POST['mission_idx'];

// Prepare the SQL statement
$sql = "DELETE FROM missions WHERE id = ? AND mission_idx = ?";

// Create a prepared statement
$stmt = $db->prepare($sql);

// Bind the parameter
$stmt->bind_param("si", $missionId, $mission_idx);

// Execute the statement
$stmt->execute();

// Close the statement and connection
$stmt->close();
$db->close();

?>
