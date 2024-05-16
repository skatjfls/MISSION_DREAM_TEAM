<?php

require_once("dbConfig.php");
require_once("DefaultSetting.php");

if (!session_id()) {
    session_start();
}

$id = $_SESSION['id'];

$group_name = isset($_POST['groupName']) ? $_POST['groupName'] : null;
if ($group_name == null) {
    echo json_encode("Group name is required");
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
    echo json_encode($e->getMessage());
    exit();
}

if (empty($group_member_id_list)) {
    echo json_encode("그룹 내에 멤버가 없습니다");
    exit();
} else {
    foreach ($group_member_id_list as $member_id) {
        $error_message = ""; // 각 회원 루프마다 에러 메시지 초기화

        try {
            $sql = "SELECT name FROM member WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("s", $member_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $member_name = $result->fetch_assoc()['name'];
            $stmt->close();
        } catch (Exception $e) {
            $member_name = null;
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
            $sql = "SELECT mission, complete, photo FROM missions WHERE id = ?"; //이거 missions 맞나요?
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

        array_push($member_list, json_encode(
            array(
                "id" => $member_id,
                "name" => $member_name,
                "missionList" => $mission_list,
                "missionTotalCount" => $mission_total_count,
                "missionNotCompleteCount" => $mission_not_complete_count,
                "error" => $error_message
            )
        ));
    }
}

echo json_encode($member_list);

$db->close();

?>
