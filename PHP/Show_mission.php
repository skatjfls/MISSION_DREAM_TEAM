<?php
// 2024.04.11 nimo
require_once 'dbConfig.php';
require_once 'DefaultSetting.php';
// ini_set("session.cookie_domain", '.dev.local');
// session_set_cookie_params(3600, '/', '.dev.local');

// echo "세션 아이디 : " . session_id();
// exit;

// echo json_encode($_COOKIE['id']);

// ini_set("session.cookie_domain", '.dev.local');
// session_set_cookie_params(3600, '/', '.dev.local');

// if(!isset($_SESSION)) {
//     session_start();
//  }         // <---- 키면 리액트가 터짐---------------------------------------------------------------

if (!isset($_SESSION['id'])){
    // Redirect to login page
    echo json_encode(null);
    exit;
}
else{
    $id = $_SESSION['id'];
}

// Create a SQL statement to fetch missions from the database
$sql = "SELECT id, mission, photo, complete FROM missions WHERE id = ?";

// Execute the SQL statement
$stmt = $db->prepare($sql);
$stmt->bind_param("s",$id);
$stmt->execute();
$result = $stmt->get_result();

// Check if there are any missions
if ($result->num_rows > 0) {
    $mission_list = array();
    // Loop through each mission and display the details
    while ($row = $result->fetch_assoc()) {
        $mission_list[] = $row;
    }

    echo json_encode($mission_list);

} else {
    echo json_encode(null);
}

// Close the connection
$stmt->close();
$db->close();
?>