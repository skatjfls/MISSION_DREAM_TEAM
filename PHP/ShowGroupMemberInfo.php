<?php

 
include('index.php');

if (!session_id()) {
    session_start();
}

if (!$_SESSION['id']){
    echo "그룹 이름이 필요합니다";
    exit();
}else{
    $id = $_SESSION['id'];
}


$group_name = isset($_POST['groupName']) ? $_POST['groupName'] : null;
if ($group_name == null) {
    echo "그룹 이름이 필요합니다";
    exit();
}

$error_message = "";
$member_list = array();
$group_member_id_list = array();

try {
    $sql = "SELECT id FROM groupmember WHERE group_name = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("s", $group_name);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        array_push($group_member_id_list, $row['id']);
    }
    $stmt->close(); // stmt 객체 닫기
} catch (Exception $e) {
    echo $e->getMessage();
    exit();
}

if (empty($group_member_id_list)) {
    echo "그룹 내에 멤버가 없습니다";
    exit();
} else {
    foreach ($group_member_id_list as $member_id) {
        $error_message = ""; // 각 회원 루프마다 에러 메시지 초기화

        try {
            $sql = "SELECT name, profileImage FROM member WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $member_name = $row['name'];
            $member_profile = $row['profileImage'];
            $stmt->close();

            if($member_profile == null){
                // $member_profile = "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png";
                $member_profile = "img/default_profile.png";
            }

        } catch (Exception $e) {
            $member_name = null;
            $member_profile = null;
            $error_message .= $e->getMessage() . "\n";
        }

        try {
            $sql = "SELECT mission, complete FROM missions WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $mission_total_count = 0;
            $mission_not_complete_count = 0;
            while ($row = $result->fetch_assoc()) {
                $mission_total_count++;
                if ($row['complete'] == false || $row['complete'] == 0) {
                    $mission_not_complete_count++;
                }
            }
            $stmt->close();
        } catch (Exception $e) {
            $mission_total_count = null;
            $mission_not_complete_count = null;
            $error_message .= $e->getMessage() . "\n";
        }

        try {
            $sql = "SELECT mission, complete, photo FROM missions WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $mission_list = array();
            while ($row = $result->fetch_assoc()) {
                array_push($mission_list, json_encode($row));
            }
            $stmt->close();
        } catch (Exception $e) {
            $error_message .= $e->getMessage() . "\n";
            $mission_list = array();
        }

        try{
            $sql = "SELECT point_total FROM groupmember WHERE id = ? AND group_name = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("ss",$member_id, $group_name);
            $stmt->execute();
            $result = $stmt->get_result();
            $mission_total_point = $result->fetch_assoc()['point_total'];
            $stmt->close();
        } catch (Exception $e){
            $error_message .= $e->getMessage() . "\n";
            $mission_total_point = NULL;
        }

        array_push($member_list, json_encode(
            array(
                "id" => $member_id,
                "name" => $member_name,
                "profileImage"=>$member_profile,
                "missionList" => $mission_list,
                "missionTotalCount" => $mission_total_count,
                "missionNotCompleteCount" => $mission_not_complete_count,
                "missionTotalPoint" => $mission_total_point,
                "error" => $error_message
            )
        ));
    }
}

echo json_encode($member_list);

$db->close();
?>
