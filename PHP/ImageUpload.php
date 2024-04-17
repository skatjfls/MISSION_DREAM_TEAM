<?php
    require_once 'dbConfig.php';

    if (!isset($_SESSION['id'])) {
        echo json_encode(array('error' => '로그인이 필요합니다.'));
        exit;
    }
    else{
        try{
            checkImage();
            uploade();
            echo json_encode(array('success' => '이미지 업로드 성공'));
            exit;
        }
        catch(Exception $e){
            echo json_encode(array('error' => $e->getMessage() . '</h4>'));
            exit;
        }
    }

    

function checkImage(){ 
    // 이미지 파일이 첨부되었는지 확인
    if(! isset($_FILES['imgFile'])){
        echo json_encode(array('error' => '파일이 첨부되지 않았습니다.'));
        exit;
    }
    if (! isset($_FILES['image']['error']) || ! is_int($_FILES['imgFile'])) {
        echo json_encode(array('error' => '파일 업로드 에러가 발생하였습니다.'));
        exit;
    }
    else{
        // 업로드 파일 검수 시작
        $allowed_ext = array('jpg', 'jpeg', 'png', 'gif');
        /************************
         Image Files Structure
        - imgFile
        - name
        - full_path
        - type
        - tmp_name
        - error
        - size

        array(1) {
        ["imgFile"]=>
        array(6) {
            ["name"]=>
            string(8) "test.png"
            ["full_path"]=>
            string(8) "test.png"
            ["type"]=>
            string(9) "image/png"
            ["tmp_name"]=>
            string(24) "C:\xampp\tmp\phpBFDE.tmp"
            ["error"]=>
            int(0)
            ["size"]=>
            int(337412)(bytes)
         * *****************************/

        // 변수 정리
        $error = $_FILES['imgFile']['error'];
        $name = $_FILES['imgFile']['name'];
        $ext = explode('.', $name);
        $ext = strtolower(array_pop($ext));

        $type =  $_FILES['imgFile']['type'];
        $fileSize = $_FILES['imgFile']['size'];
        $fileLimit = 1024 * 1024 * 25; // 25MB
        
        if($fileSize > $fileLimit){
            echo json_encode(array('error' => '파일 업로드 제한 용량을 초과하였습니다.'));
            exit;
        }

        // 오류 확인
        if($error != UPLOAD_ERR_OK){
            switch($error){
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    echo json_encode(array('error' => '파일이 너무 큽니다.'));
                    break;
                case UPLOAD_ERR_NO_FILE:
                    echo json_encode(array('error' => '파일이 첨부되지 않았습니다.'));
                    break;
                default:
                    echo json_encode(array('error' => '파일이 제대로 업로드되지 않았습니다.'));
            }
            exit;
        }

        // 확장자 확인
        if(!in_array($ext, $allowed_ext)){
            echo json_encode(array('error' => '허용되지 않는 확장자입니다.'));
            exit;
        }
        /*************************** 업로드 파일 검수 끝 ***************************/
    }
}

function uploade(){

    include 'dbConfig.php';

    if (is_uploaded_file($_FILES['imgFile']['tmp_name']) && getimagesize($_FILES['imgFile']['tmp_name']) != false){
        // 이미지 크기 확인
        $size = getimagesize($_FILES['imgFile']['tmp_name']);

        // 변수 정리
        $type = $size['mime'];
        $imgfp = fopen($_FILES['imgFile']['tmp_name'], 'rb');
        $size = $size[3];
        $name = $_FILES['imgFile']['name'];
        $maxsize = 99999999;

        // 이미지 크기 확인
        if($_FILES['imgFile']['size'] > $maxsize){
            echo json_encode(array('error' => '파일이 너무 큽니다.'));
            exit;
        }
        else{
            // DB에 이미지 저장
            $id = $_SESSION['id'];
            $mission_idx = $_POST['mission_idx'];
            $sql = "UPDATE mission SET photo = ? WHERE id = ? AND mission_idx = ?";      
            $stmt = $db->prepare($sql);
            $stmt->bind_Param(1, $imgfp, PDO::PARAM_LOB);
            $stmt->bind_Param(2, $id, PDO::PARAM_STR);
            $stmt->bind_Param(3, $mission_idx, PDO::PARAM_INT);

            if($stmt->execute()){
                echo json_encode(array('success' => '이미지 업로드 성공'));
                exit;
            }
            else{
                echo json_encode(array('error' => '이미지 업로드 실패'));
                exit;
            }
        }
    }
    else{
        echo json_encode(array('error' => '이미지 파일이 아닙니다.'));
        exit;
    }
}
?>