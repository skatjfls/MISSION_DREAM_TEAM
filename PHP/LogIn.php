<?php
// 240410 김현수 작성

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// db 연결
require_once("dbConfig.php");

// 프론트에서 json 형태로 쏴주는 데이터를 json_decode 하여 변환
// id, password 받아서 변수에 저장
$data = json_decode(file_get_contents('php://input'), true);
$id = $data["id"];
$password = md5($data["password"]);

// member 테이블에서 이용자 찾아서 member 연관 배열에 저장
$query_findMember = "SELECT * FROM member WHERE id = '$id' AND password = '$password'";
$res_member = $db->query($query_findMember);
$row_member = $res_member->fetch_array(MYSQLI_ASSOC);

// group_member 테이블에서 이용자가 속한 그룹 찾고, 있으면 $groupList 배열에 저장
$query_findGroup = "SELECT group_name FROM groupmember WHERE id = '$id'";
$res_group = $db->query($query_findGroup);

if($res_group){
    $groupList = array();

    while($row = $res_group->fetch_array(MYSQLI_ASSOC)){
        $groupList[] = $row;
    }
}

if($row_member){

    session_start();

    //세션에 아이디, 이름 저장
    $_SESSION['id'] = $id;
    $_SESSION['name'] = $row_member['name'];

    // echo "사용자 ID : ", $_SESSION['id'], "\n";
    // echo "사용자 이름 : ", $_SESSION['name'], "\n";

    // 사용자가 그룹이 있으면 세션에 이용자의 그룹 리스트 저장
    // if($groupList){

    //     $_SESSION['group'] = $groupList;
    //     // echo "세션에 그룹리스트 삽입\n";

        // foreach($_SESSION['group'] as $group){
        //     echo "사용자가 속한 그룹 : ", $group[0], "\n";
        // }
        // echo "사용자가 속한 그룹 : ", $_SESSION['group'][0], "\n";
        // echo "사용자가 속한 그룹 : ", $_SESSION['group'][1], "\n";
        // echo "사용자가 속한 그룹 : ", $_SESSION['group'][2], "\n";
    // }else{
    //     // echo "그룹은 없습니다. !\n";
    // }

    echo json_encode(true); 


}else{
    echo json_encode(false);
}

mysqli_close($db);

?>

