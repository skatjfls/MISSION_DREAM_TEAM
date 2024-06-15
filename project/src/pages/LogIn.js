import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Login.css';
axios.defaults.withCredentials = true;

function LogIn(props) {

    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(0);
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.userId)
    const [showRightPanel, setShowRightPanel] = useState(false);
    let [showAlert, setShowAlert] = useState(false);
    const [alertContent, setAlertContent] = useState('');
    const [alertImage, setAlertImage] = useState('');

    useEffect(() => {
        axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/CheckLoginState.php')
        .then(res => {
        if(res.data === true){
            navigate('/');
        }
        })
        .catch(error => {
        console.error('Error fetching user info:', error)
        })

        axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/UserCnt.php')
        .then(res => {
            setUserCount(res.data);
        })
        .catch(error => {
            console.error('Error fetching user count:', error)
        });
    },[]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                if (!showRightPanel) {
                    setShowRightPanel(true);
                }
                else if (!showAlert){
                    onClickLogin(event);
                }
                else if (showAlert) {
                    setShowAlert(false)
                }
            }
        };

        document.addEventListener('keypress', handleKeyPress);
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, [showAlert, showRightPanel]);
    
    const onClickLogin = (event) => {
        event.preventDefault();
        const idIsEmpty = checkField('id');
        const passwordIsEmpty = checkField('password');

        if (idIsEmpty || passwordIsEmpty) {
            setAlertContent('아이디 및 비밀번호를 입력해주세요!');
            setAlertImage('/img/dream_X.gif');
            setShowAlert(true);
        }
    
        if (!idIsEmpty && !passwordIsEmpty) {
            const inputId = document.getElementById('id').value;
            const inputPw = document.getElementById('password').value;
            const keepLogIn = document.getElementById('keepLogIn').checked;
    
            axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/LogIn.php',
            {
                id: inputId,
                password: inputPw,
                KeepLogIn: keepLogIn
            })
            .then((res)=>{
                if (res.data == true) {
                    navigate('/');
                }
                else {
                    setAlertContent('아이디와 비밀번호를 확인해주세요!');
                    setAlertImage('/img/dream_X.gif');
                    setShowAlert(true);
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }

    const checkField = (fieldId) => {
        let fieldValue = document.getElementById(fieldId).value;
        if (fieldValue == '') {
            return true
        }
        else{
            return false
        }
    }

    return (
        <div className="Login">
            <div className={`login-box ${showRightPanel ? 'show-right-panel' : ''}`}>
                <div className="login-left">
                    <h1 className='text-title text-today'>오늘의 갓생러는 {userCount}명!</h1>
                    <h3 className='text-title'>로그인으로 미션을 Unlock -☆</h3>
                    <div>
                        <button className='text-today-box' onClick={() => setShowRightPanel(!showRightPanel)}>오늘의 미션은 무엇일까요? <span>click!</span></button>
                        <img className="img-cursor" src="/img/cursor.png"></img>
                    </div>
                </div>
                <div className="login-right">
                    <div className='login-logo'>
                        <img className="login-logo-img" src="/img/dream.png"></img>
                    </div>
                    <input className="login-input login-inputtext" type="text" placeholder="ID" id="id"></input>
                    <input className="login-input login-inputtext" type="password" placeholder="PASSWORD" id="password"></input>
                    <button className="login-button" onClick={onClickLogin}>미션하러 가기</button>
                    <div className="login-input">
                    <label>
                        <input type="checkbox" id="keepLogIn"></input>
                        로그인 유지
                    </label>
                    <span onClick={()=>{ props.navigate('/signup')}}>회원가입</span>
                    </div>
                </div>
            </div>
            <AlertModal showAlert={showAlert} setShowAlert={setShowAlert} alertContent={alertContent} alertImage={alertImage}/>
        </div>
    );
}

function AlertModal({showAlert, setShowAlert, alertContent, alertImage}) {
    return(
        <Modal className="modal" show={showAlert} onHide={() => {setShowAlert(false);}}>
        <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center modalBody'>
            <p>{alertContent}</p>
            {alertImage && <img className="dreams" src={alertImage} alt="Result" style={{ width: '100px' }} />}
        </Modal.Body>
        <Modal.Footer>
            <Button className="modalClose" variant="secondary" onClick={() => {setShowAlert(false);}}>
                닫기
            </Button>
        </Modal.Footer>
        </Modal>
    );
}

export default LogIn;