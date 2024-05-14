<?php

require_once("dbConfig.php");
require_once("DefaultSetting.php");

if(!session_id()){
    session_start();
}
/***
 * 미션 전체 카운트 보내기
 * 미션 안 한거 카운트 보내기
 * 포인트 보내는거 없애기
 * achieve따로 보내기
 */


// 세션에서 아이디 받기
$id = $_SESSION['id'];

$group_name = isset($_POST['group_name']) ? $_POST['group_name'] : null;
if ($group_name == null) {
    echo "Group name is required";
    exit();
}
/*
JsonDataStructure
{
    [{
        "id":"test1",
        "name":"test1",
        "missionList":[
            {
                "mission" : "잠자기",
                "complete" : "true",
                "photo" : "photo1.jpg"
            },
        ]
        "error" : "error message"
    },
    ]
}
*/
$error_message = "";
$member_list = array();
$group_member_id_list = array();
try{
    $sql = "SELECT id FROM groupmember WHERE group_name = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("s", $group_name);
    $stmt->execute();
    $reuslt->$stmt->get_result();
    
    while($row = $reuslt->fetch_assoc()){
        if($row == null){
            break;
        }
        array_push($group_member_id_list, $row['id']);
    }
}catch(Exception $e){
    echo json_encode($e->getMessage());
    exit();
}

if(empty($group_member_id_list)){
    echo json_encode("그룹 내에 멤버가 없습니다");
    exit();
}else{
    foreach ($group_member_id_list as $member_id){

        // member_id로 member 테이블에서 이름 가져오기
        try{
            $sql = "SELECT name FROM member WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();
            $reuslt->$stmt->get_result();
            $member_name = $reuslt->fetch_assoc()['name'];
        }catch (Exception $e){
            $member_name = null;
            $error_message = $error_message . $e->getMessage() . "\n";
        }finally{
            if ($stmt != null){
                $stmt->close();
            }
        }
    
        // member_id로 overall 테이블에서 point, date 가져오기
        // try{
        //     $sql = "SELECT date FROM overall WHERE id = ?";
        //     $stmt = $db->prepare($sql);
        //     $stmt->bind_param("s", $member_id);
        //     $stmt->execute();
        //     $reuslt->$stmt->get_result();
        //     $achieve_list = array();
    
        //     /***
        //      * DB date Strucutre
        //      * {
        //      *   "2020-01-01" : 100,
        //      *   "2020-01-02" : 200
        //      * }
        //      * 
        //      * ***/
    
        //     while($row = $reuslt->fetch_assoc()){
        //         if($row == null){
        //             break;
        //         }
        //         $member_overall_keys = array_keys($row);
        //         foreach ($member_overall_keys as $date){
        //             $data = array(
        //                 "date" => $date,
        //                 "point" => $row[$date]
        //             );
        //         }
        //         array_push($achieve_list, json_encode($data));
        //     }
        // }catch (Exception $e){
        //     echo "Error: " . $e->getMessage();
        //     exit();
        // }finally{
        //     if ($stmt != null){
        //         $stmt->close();
        //     }
        // }
    
        // mission_count, mission_not_complete_count 가져오기
        try{
            $sql = "SELECT mission, complete FROM missions WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();
            $reuslt->$stmt->get_result();
    
            $mission_total_count = 0;
            $mission_not_complete_count = 0;
    
            while($row = $reuslt->fetch_assoc()){
                if($row == null){
                    break;
                }
                $mission_total_count++;
                if($row['complete'] == false or $row['complete'] == 0){
                    $mission_not_complete_count++;
                }
            }
        }catch(Exception $e){
            $mission_total_count = null;
            $mission_not_complete_count = null;
            $error_message = $error_message . $e->getMessage() . "\n";
        }finally{
            if ($stmt != null){
                $stmt->close();
            }
        }
    
        // member_id로 mission 테이블에서 mission, complete, photo 가져오기
        try{
            $sql = "SELECT mission, complete, photo FROM mission WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();
            $reuslt->$stmt->get_result();
    
            $mission_list = array();
    
            while($row = $reuslt->fetch_assoc()){
                if($row == null){
                    break;
                }
                array_push($mission_list, json_encode($row));
            }
        }catch (Exception $e){
            $error_message = $error_message . $e->getMessage() . "\n";
            $mission_list = array();
        }finally{
            if ($stmt != null){
                $stmt->close();
            }
        }
    
        array_push($member_list,
            json_encode(
                array(
                    "id" => $member_id,
                    "name" => $member_name,
                    "missionList" => $mission_list,
                    "missionTotalCount" => $mission_total_count,
                    "missionNotCompleteCount" => $mission_not_complete_count,
                    "error" => $error_message
                )
            )
        );
    }
}



echo $member_list;

$db->close();

?>