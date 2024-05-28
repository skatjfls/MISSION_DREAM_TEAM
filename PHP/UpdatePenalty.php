<?php
//240520 김현수 작성

 
include('index.php');

$groupName = $_POST["groupName"];
$newPenalty = isset($_POST["Penalty"]) ? $_POST['Penalty'] : null;

// $groupName = "더불어민주당";
// $newPenalty = null;

if($groupName == null){
    echo "그룹이 존재하지 않습니다";
    exit();
}

if($newPenalty == null){
    echo "선택한 벌금이 존재 하지 않습니다.";
    exit();
}

$query = "UPDATE grouplist SET PenaltyPerPoint = '$newPenalty' WHERE group_name = '$groupName'";
$db->query($query);

echo json_encode(true);

mysqli_close($db);

?>