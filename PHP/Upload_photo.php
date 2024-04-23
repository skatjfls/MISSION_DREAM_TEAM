<?php
// 2024.04.11 nimo

require_once 'dbConfig.php';

session_start();

if (!isset($_SESSION['id'])) {
    // Redirect to login page
    echo json_encode(null);
    exit;
}

// Assuming you have the mission ID and photo stored in variables
$id = $_SESSION['id'];
$mission_idx = $_POST['mission_idx'];
$photo = isset($_FILES['photo']) ? $_FILES['photo'] : null;

// Check if the photo is null
if ($photo == null) {
    die('Photo is required');
}

$sql = "UPDATE missions SET photo = ? WHERE id = ? AND mission_idx = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("ssi", $photo, $id, $mission_idx);
$stmt->execute();

// Close the statement and connection
$stmt->close();
$db->close();
?>
