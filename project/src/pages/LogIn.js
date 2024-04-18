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
                    <input className="login-input" type="text" placeholder="ID"></input>
                    <input className="login-input" type="password" placeholder="PASSWORD"></input>
                    <button className="login-button" variant="primary">미션하러 가기</button>
                    <div className="login-input">
                        <div>
                            <input type="checkbox"></input>
                            <span>로그인 유지</span>
                        </div>
                        <span onClick={()=>{ props.navigate('/signup')}}>회원가입</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogIn;