import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Login.css';
axios.defaults.withCredentials = true;

function LogIn(props) {

    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(0);
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.userId)

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

        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                onClickLogin(event);
            }
        };

        document.addEventListener('keypress', handleKeyPress);
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    },[]);

    const onClickLogin = (event) => {
        event.preventDefault();
        const idIsEmpty = checkField('id', '아이디를 입력해주세요.');
        const passwordIsEmpty = checkField('password', '비밀번호를 입력해주세요.');
    
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
                    alert('로그인에 성공했습니다.');
                    navigate('/');
                }
                else {
                    alert('아이디 또는 비밀번호를 확인해주세요.')
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }

    const checkField = (fieldId, checkText) => {
        let fieldValue = document.getElementById(fieldId).value;
        if (fieldValue == '') {
            alert(checkText)
            return true
        }
        else{
            return false
        }
    }

    return (
        <div className="Login">
            <div className="login-box">
                <div className="login-left">
                    <h1 className='text-title text-today'>오늘의 갓생러는 {userCount}명!</h1>
                    <h3 className='text-title'>로그인으로 미션을 Unlock -☆</h3>
                    <div className='text-today-box'>오늘의 미션은 무엇일까요?</div>
                    <img className="img-cursor" src="/img/cursor.png"></img>
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
        </div>
    );
}

export default LogIn;