<?php
// 2024.04.11 nimo

require_once 'dbConfig.php';

// Set the timezone to your desired timezone
date_default_timezone_set('Japan');

// Check the connection
if ($db->connect_error) {
    die('Connection failed: ' . $db->connect_error);
}

// Run the script only if it's 5 AM
if (date('H') == '05') {
    // Perform your database management tasks here

    // Get member id list
    $sql = "SELECT * FROM member";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $member_list = $stmt->get_result();

    // Check mission status and update the point status if the mission is uncompleted
    while ($member = $member_list->fetch_assoc()){
        $sql = "SELECT mission_idx FROM missions WHERE id = ? AND check = 0";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("s", $member['id']);
        $stmt->execute();
        $mission_list = $stmt->get_result();

        $failed_mission = (int) $mission_list->num_rows;

        // Update the point status if the mission is uncompleted
        if ($failed_mission > 0) {
            $sql = "UPDATE member SET point = ? WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("is", $failed_mission, $member['id']);
            $stmt->execute();
            

            // Update the group total point status
            $sql = "SELECT * FROM groupmember WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member['id']);
            $stmt->execute();
            $group_list = $stmt->get_result();
            
            while ($group = $group_list->fetch_assoc()){
                $group_point_total = $group['point_total'] - $failed_mission;
                $sql = "UPDATE group SET point = ? WHERE group_member_idx = ? AND id = ?";
                $stmt = $db->prepare($sql);
                $stmt->bind_param("iis", $group_point_total, $group['group_member_idx'], $group['id']);
                $stmt->execute();
            }
        }
    }

    // Close the database connection
    $stmt->close();
    $db->close();
}