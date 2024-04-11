<?php
require_once 'dbConfig.php';

session_start();

if (!isset($_SESSION['id'])) {
    // Redirect to login page
    echo json_encode(null);
    exit;
}

$id = $_SESSION['id'];

// Create a SQL statement to fetch missions from the database
$sql = "SELECT id, mission, photo, check FROM missions WHERE id = ?";

// Execute the SQL statement
$stmt = $db->prepare($sql);
$stmt->bind_param("i",$id);
$stmt->execute();
$result = $stmt->get_result();

// Check if there are any missions
if ($result->num_rows > 0) {
    // Loop through each mission and display the details
    while ($row = $result->fetch_assoc()) {
        $mission_idx = $row['mission_idx'];
        $missionName = $row['mission'];
        $photo = $row['photo'];
        $check = $row['check'];

    }

    echo json_encode($result);

} else {
    echo "No missions found";
}

// Close the connection
$stmt->close();
$db->close();
?>