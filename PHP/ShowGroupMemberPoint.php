<?php

 
include('index.php');

if(!session_id()){
    session_start();
}

$id = $_SESSION['id'];

$group_name = isset($_POST['groupName']) ? $_POST['groupName'] : null;

if ($group_name == null) {
    echo json_encode(array("error"=>"Group name is required"));
    exit();
}

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
    echo json_encode(array("error"=>"There are no members in the group"));
    exit();
}else{
    $member_list = array();
    foreach($member_id_list as $member_id){
        $member = array();
        $member['id'] = $member_id;
        $member['name'] = "";
        $member['point'] = array();

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
            echo json_encode(array("error"=>"Failed to get member name"));
            exit();
        }

        try{
            $sql = "SELECT date, point FROM overall WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();
            $result = $stmt->get_result();
            while($row = $result->fetch_assoc()){
                if($row == null){
                    break;
                }else{
                    // Change the structure of point array
                    $member['point'][$row['date']] = $row['point'];
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
    // Echo the member list in JSON format
    echo json_encode($member_list);

    $db->close();
}

?>
