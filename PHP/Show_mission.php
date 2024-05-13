<?php
// 2024.04.11 nimo
require_once 'dbConfig.php';
require_once 'DefaultSetting.php';


if(!session_id()){
    session_start();
}
else{
    echo "Session already started";
}

if (!isset($_SESSION['id'])){
    // Redirect to login page
    echo json_encode(null);
    exit;
}
$user_id = $_SESSION['id'];

// Create a SQL statement to fetch missions from the database
$sql = "SELECT id, mission, photo, complete FROM missions WHERE id = ?";

// Execute the SQL statement
$stmt = $db->prepare($sql);
$stmt->bind_param("s",$user_id);
$stmt->execute();
$result = $stmt->get_result();

// Create an array to store the missions
$missions = array();
while($row = $result->fetch_assoc()){
    array_push($missions, array_values($row));
}

// Return the missions as a JSON object
if (empty($missions)){
    echo json_encode(null);
    exit;
}else{
    echo json_encode($missions);
}


// Close the connection
$stmt->close();
$db->close();
?>