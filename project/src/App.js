import "react-calendar/dist/Calendar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {useContext ,useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { UserProvider, UserContext } from './UserContext';
import Group from './pages/Group.js';
import LogIn from './pages/LogIn.js';
import SignUp from './pages/SignUp.js';
import MainPage from './pages/MainPage.js';
import './App.css';

function App() {
  //let state = useSelector((state) => state )
  let [userName, setUserName] = useState();
  let [point, setPoint] = useState();
  let navigate = useNavigate();
  let [userCount] = useState(32)
  
  useEffect(() => {
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
  }, []);

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