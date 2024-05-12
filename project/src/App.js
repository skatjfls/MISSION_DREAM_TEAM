import "react-calendar/dist/Calendar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { UserProvider} from './UserContext';
import Group from './pages/Group.js';
import LogIn from './pages/LogIn.js';
import SignUp from './pages/SignUp.js';
import MainPage from './pages/MainPage.js';


function App() {
  //let state = useSelector((state) => state )
  let [userName, setUserName] = useState();
  let [point, setPoint] = useState();
  let navigate = useNavigate();
  let [userCount] = useState(32)
  const userId = useSelector((state) => state.user.userId)


  useEffect(() => {
    // 로그인 상태를 확인하는 코드...
    // if (userId === ''){
    //   navigate('/login')
    // }
    axios.get('http://localhost:3001/PHP/GetInfo.php')
    .then(res => {
      console.log(res);
      const userData = res.data;
      setUserName(userData.name);
      setPoint(userData.point);
    })
    .catch(error => {
      console.error('Error fetching user info:', error)
    })
  }, [userId, navigate]);

  return (
    <div className="App">
      <UserProvider>
        <Routes>
          <Route path="/" element={<MainPage userName={userName} point={point} navigate={navigate}/>}/>
          <Route path="/login" element={ <LogIn userCount={userCount} navigate={navigate}/> }/>
          <Route path="/signup" element={ <SignUp/> }/>
          <Route path="/group" element={ <Group/> }/>
          <Route path="*" element={<div>404</div>}/>
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;