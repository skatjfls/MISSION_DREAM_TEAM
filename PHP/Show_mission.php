<?php
// 2024.04.11 nimo
 
include('index.php');


if(!session_id()){
    session_start();
}

if (!isset($_SESSION['id'])){
    // Redirect to login page
    echo json_encode(null);
    exit;
}else{
    $user_id = $_SESSION['id'];
}


// Create a SQL statement to fetch missions from the database
$sql = "SELECT * FROM missions WHERE id = ?";

// Execute the SQL statement
$stmt = $db->prepare($sql);
$stmt->bind_param("s",$user_id);
$stmt->execute();
$result = $stmt->get_result();

// Create an array to store the missions
$missions_list = array();
while($row = $result->fetch_assoc()){
    array_push($missions_list, array_values($row));
}

// Return the missions as a JSON object
if (empty($missions_list)){
    echo json_encode(null);
    exit;
}else{
    echo json_encode($missions_list);
}


// Close the connection
$stmt->close();
$db->close();
?>