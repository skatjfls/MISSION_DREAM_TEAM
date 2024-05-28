<?php
// 2024.04.11 nimo

 
include('index.php');

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
        
        $member_id = $member['id'];

        // 멤버 overall 포인트 업데이트
        try{
            $sql = "INSERT INTO overall ( id, date, point) 
            VALUES (?, 
            (DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
            (SELECT COUNT(*)
                FROM missions AS m 
                WHERE m.complete = 0 AND id = ?)
            )";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("ss",$member_id,$member_id);
            $stmt->execute();
        }catch(Exception $e){
            echo json_encode(array("error"=>$e->getMessage()));
            exit();
        }


        // try{
        //     $sql = "UPDATE overall AS o
        //     JOIN (
        //         SELECT m.id, COUNT(*) AS uncompleted_mission 
        //         FROM missions AS m 
        //         WHERE m.complete = 0 AND id = ?
        //         GROUP BY m.id
        //     ) AS subquery ON o.id = subquery.id
        //     SET o.point = subquery.uncompleted_mission
        //     WHERE o.date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";
        //     $stmt = $db->prepare($sql);
        //     $stmt->bind_param("s", $member_id);
        //     $stmt->execute();
        // }catch(Exception $e){
        //     echo json_encode(array("error"=>$e->getMessage()));
        // }

        

        // // 새로운 overall 생성
        // try{
        //     $sql = "INSERT INTO overall (id, date, point)
        //     VALUES (?, CURDATE(), 0)";
        //     $stmt = $db->prepare($sql);
        //     $stmt->bind_param("s", $member_id);
        //     $stmt->execute();
        // }catch(Exception $e){
        //     echo json_encode(array("error"=>$e->getMessage()));
        //     exit();
        // }

        // groupmember point_total 업데이트
        try{
            $sql = "UPDATE groupmember AS gm
            JOIN (
                SELECT o.id , o.point FROM overall AS o 
                WHERE o.id = ? AND o.date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
            ) AS subquery ON gm.id = subquery.id
            SET gm.point_total = gm.point_total + subquery.point";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();
        }catch(Exception $e){
            echo json_encode(array("error"=>$e->getMessage()));
        }

        // missions 이미지 삭제
        try{
            $sql = "SELECT photo FROM missions WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();
            $photo_list = $stmt->get_result();

            $sql = "UPDATE missions SET photo = NULL, complete = 0 WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();

            $folderPath = "../project/uploads/" . $member_id . "/";
            
            while($photo = $photo_list->fetch_assoc()){
                $filePath = $photo['photo'];
                if($filePath != null){
                    if(file_exists($filePath)){
                        unlink($filePath);
                    }
                }
                
            }

        }catch(Exception $e){
            echo json_encode(array("error"=>$e->getMessage()));
        }
    }   
     
    // Close the database connection
    $stmt->close();
    $db->close();
}