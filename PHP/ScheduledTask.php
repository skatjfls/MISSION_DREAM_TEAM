<?php
// 2024.04.11 nimo

require_once 'dbConfig.php';
require_once 'DefaultSetting.php';

// Set the timezone to your desired timezone
date_default_timezone_set('Japan');

/***
 * 순서대로
 * 1. 5시에 실행
 * 2. 
 * overall에 있는 point 0으로 만들기
 * 
 */


// member의 ID를 가져와서 한번에 업데이트 하는 것은 너무 오래 걸린다.
// 그래서 member의 ID를 가져와서 하나씩 업데이트 하는 것으로 변경
{
    // Perform your database management tasks here

    // Get member id list
    $sql = "SELECT id FROM member";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $member_list = $stmt->get_result();

    // Check mission status and update the point status if the mission is uncompleted
    while ($member = $member_list->fetch_assoc()){

        // 멤버 overall 포인트 업데이트
        try{
            $sql = "UPDATE overall AS o
            JOIN (
                SELECT m.id, COUNT(*) AS uncompleted_mission 
                FROM missions AS m 
                WHERE m.complete = 0 AND id = ?
                GROUP BY m.id
            ) AS subquery ON o.id = subquery.id
            SET o.point = subquery.uncompleted_mission
            WHERE o.date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member['id']);
            $stmt->execute();
        }catch(Exception $e){
            echo json_encode(array("error"=>$e->getMessage()));
        }

        // 새로운 overall 생성
        try{
            $sql = "INSERT INTO overall (id, date, point)
            VALUES (?, CURDATE(), 0)";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member['id']);
            $stmt->execute();
        }catch(Exception $e){
            echo json_encode(array("error"=>$e->getMessage()));
            exit();
        }

        // groupmember point_total 업데이트
        try{
            $sql = "UPDATE groupmember AS gm
            JOIN (
                SELECT o.id , o.point FROM overall AS o 
                WHERE o.id = ? AND o.date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
            ) AS subquery ON gm.id = subquery.id
            SET gm.point_total = gm.point_total + subquery.point";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member['id']);
            $stmt->execute();
        }catch(Exception $e){
            echo json_encode(array("error"=>$e->getMessage()));
        }
    }   
     
    // Close the database connection
    $stmt->close();
    $db->close();
}