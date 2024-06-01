<?php
     
    include('index.php');

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
        $fileSize = $_FILES['imgFile']['size'];
        $error = $_FILES['imgFile']['error'];
        $name = explode('.', $_FILES['imgFile']['name'])[0];
        $type = $_FILES['imgFile']['type'];
        $ext = explode('/', $type)[1];
        //$size = $fileSize[3];  "wdith="xxx" height=xxx"

       
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


        
        $id = $_SESSION['id'];
        $folderPath = '../project/public/uploads/' . $id;
        $mission_idx = $_POST['mission_idx'];

        if(!file_exists($folderPath)){
            mkdir($folderPath, 0700, true);
        }

        //이전 이미지 서버에서 삭제
        try{
            $sql = "SELECT photo FROM missions WHERE id = ? AND mission_idx = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param('si', $id, $mission_idx);
            $stmt->execute();
            $result = $stmt->get_result();

            while($row = $result->fetch_assoc()){
                $photo = $row['photo'];
                if($photo != null){
                    $filePath = $photo;
                    if(file_exists($filePath)){
                        unlink($filePath);
                    }
                }
            }
        }catch(Exception $e){
            echo json_encode(array('error' => '이전 이미지 삭제 중 오류가 발생하였습니다.'));
            exit;
        }


        //이미지 업로드 시작
        try{
            if (is_uploaded_file($_FILES['imgFile']['tmp_name']) && getimagesize($_FILES['imgFile']['tmp_name']) != false){            
                try{
                    // DB에 이미지 경로 저장
                    $fileName = md5($name.'/'.time().'/'.mt_rand()).'.'.$ext;
                    $filePath = $folderPath . '/' . $fileName;
    
                    $sql = "UPDATE missions SET photo = ?, complete = 1 WHERE id = ? AND mission_idx = ?";
                    $stmt = $db->prepare($sql);
                    $stmt->bind_param('ssi', $filePath, $id, $mission_idx);
                    $stmt->execute();
    
                    move_uploaded_file($_FILES['imgFile']['tmp_name'], $filePath);
    
                    echo json_encode(true);
                    exit;
    
                } catch(Exception $e){
                    $error_message = '이미지 업로드 실패' . $e->getMessage();
                    echo json_encode(array('error' => $error_message), JSON_UNESCAPED_UNICODE);
                    exit;
    
                }finally{
                    if($stmt){
                        $stmt->close();
                    }
                    if($db){
                        $db->close();
                    }
                }
            }
        }catch(Exception $e){
            echo json_encode(array('error' => '이미지 업로드 중 오류가 발생하였습니다.'));
            exit;
        }
    }
?>
