import axios from 'axios';
import './Login.css';
function LogIn(props) {
    return (
        <div className="Login">
            <div className="login-box">
                <div className="login-left">
                    <h3>오늘의 갓생러는 {props.userCount}명!</h3>
                    <h4>로그인으로 미션을 Unlock -☆</h4>
                    <div>오늘의 미션은 무엇일까요?</div>
                </div>
                <div className="login-right">
                    <input className="login-input" type="text" placeholder="ID" id="id"></input>
                    <input className="login-input" type="password" placeholder="PASSWORD" id="password"></input>
                    <button className="login-button" onClick={onClickLogin}>미션하러 가기</button>
                    <div className="login-input">
                    <label>
                        <input type="checkbox"></input>
                        로그인 유지
                    </label>
                    <span onClick={()=>{ props.navigate('/signup')}}>회원가입</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function checkField(fieldId, checkText) {
    let fieldValue = document.getElementById(fieldId).value;
    if (fieldValue == '') {
        alert(checkText)
        return true
    }
    else{
        return false
    }
}

function onClickLogin(event) {
    event.preventDefault();
    const idIsEmpty = checkField('id', '아이디를 입력해주세요.');
    const passwordIsEmpty = checkField('password', '비밀번호를 입력해주세요.');

    if (!idIsEmpty && !passwordIsEmpty) {
        const inputId = document.getElementById('id').value;
        const inputPw = document.getElementById('password').value;

        axios.post('http://localhost:3307/PHP/LogIn.php',
        {
            id: inputId,
            password: inputPw
        })
        .then((res)=>{
            console.log(res)
            if (res == true) {
                alert('로그인에 성공했습니다.')
                window.location.replace('/')
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

export default LogIn;