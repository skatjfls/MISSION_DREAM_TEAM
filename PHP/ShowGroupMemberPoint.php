<?php

require_once("dbConfig.php");
require_once("DefaultSetting.php");

if(!session_id()){
    session_start();
}

// 세션에서 아이디 받기
$id = $_SESSION['id'];

$group_name = isset($_POST['group_name']) ? $_POST['group_name'] : null;
if ($group_name == null) {
    echo json_encode(array("error"=>"Group name is requiared"));
    exit();
}

// JsonDataStructure
/*
 * [
 *  {
 *    "id":"test1",
 *   "name":"test1",
 *   "point" : {
 *      "2024.05.13" : 100,
 *      "2024.05.12" : 200,}
 *  },
 * ]
 */

try{
    $sql = "SELECT id FROM groupmember WHERE group_name = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("s", $group_name);
    $stmt->execute();
    $result = $stmt->get_result();

    $member_id_list = array();
    while($row = $result->fetch_assoc()){
        if($row == null){
            break;
        }
        array_push($member_id_list, $row['id']);
    }
}catch(Exception $e){
    echo json_encode(array("error"=>$e->getMessage()));
    exit();
}finally{
    $stmt->close();
}

if(empty($member_id_list)){
    echo json_encode(array("error"=>"그룹 내에 멤버가 없습니다."));
    exit();
}else{
    $member_list = array();
    foreach($member_id_list as $member_id){
        $member = array();
        $member['id'] = $member_id;
        $member['name'] = "";
        $member['point'] = array();

        // 멤버 이름 가져오기
        try{
            $sql = "SELECT name FROM member WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $member['name'] = $row['name'];
        }catch(Exception $e){
            echo json_encode(array("error"=>$e->getMessage()));
            exit();
        }finally{
            $stmt->close();
        }

        if($member['name'] == null){
            echo json_encode(array("error"=>"멤버 이름을 가져오는데 실패했습니다."));
        }

        // 멤버 포인트 가져오기
        try{
            $sql = "SELECT date FROM overall WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();
            $result = $stmt->get_result();
            while($row = $result->fetch_assoc()){
                if($row == null){
                    break;
                }else{
                    $member['point'] = $row['date'];
                }
            }
        }catch(Exception $e){
            echo json_encode(array("error"=>$e->getMessage()));
            exit();
        }finally{
            $stmt->close();
        }
        array_push($member_list, $member);
    }
    echo $member_list;
    $db->close();
}

?>