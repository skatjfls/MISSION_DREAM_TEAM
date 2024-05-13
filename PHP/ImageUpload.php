<?php
    require_once 'dbConfig.php';
    require_once 'DefaultSetting.php';

    if(!session_id()){
        session_start();
    }
    if (!isset($_SESSION['id'])) {
        echo json_encode(array('error' => '로그인이 필요합니다.'));
        exit;
    }

    // 이미지 파일이 첨부되었는지 확인
    if(! isset($_FILES['imgFile'])){
        echo json_encode(array('error' => '파일이 첨부되지 않았습니다.'));
        exit;
    }
    if (! isset($_FILES['imgFile']['error']) || ! is_int($_FILES['imgFile']['error'])) {
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

        try{
           upload();

        }catch(Exception $e){
            echo json_encode(array('error' => '이미지 업로드 중 오류가 발생하였습니다.'));
            exit;
        }
    }

function upload(){

    include 'dbConfig.php';

    if (is_uploaded_file($_FILES['imgFile']['tmp_name']) && getimagesize($_FILES['imgFile']['tmp_name']) != false){
        // 이미지 크기 확인
        $size = getimagesize($_FILES['imgFile']['tmp_name']);

        // 변수 정리
        $type = $size['mime'];
        $fileContent = file_get_contents($_FILES['imgFile']['tmp_name']);
        $fileContentUtf8 = mb_convert_encoding($fileContent, 'UTF-8');
        $fileContentBase64 = base64_encode($fileContentUtf8);
        $size = $size[3];
        $name = $_FILES['imgFile']['name'];
        $maxsize = 99999999;

        // 이미지 크기 확인
        if($_FILES['imgFile']['size'] > $maxsize){
            echo json_encode(array('error' => '파일이 너무 큽니다.'));
            exit;
        }
        else{
            try{
                $test = '테스트 입니다';
                // DB에 이미지 저장
                $id = $_SESSION['id'];
                $mission_idx = $_POST['mission_idx'];
                $sql = "UPDATE missions SET photo = ? WHERE id = ? AND mission_idx = ?";
                $stmt = $db->prepare($sql);
                $stmt->bind_param('sbi', $test, $id, $mission_idx);
                $stmt->execute();

                echo json_encode(array('success' => '이미지 업로드 성공'));

            } catch(Exception $e){
                $error_message = '이미지 업로드 실패' . $e->getMessage();
                echo json_encode(array('error' => $error_message));
                exit;

            }finally{
                if($stmt){
                    $stmt->close();
                }
                if($db){
                    $db->close();
                }
            }
            echo json_encode(array('message' => '종료'));
            exit;
        }
    }
    else{
        echo json_encode(array('error' => '이미지 파일이 아닙니다.'));
        exit;
    }
}
?>