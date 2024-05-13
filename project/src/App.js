import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
import { useEffect, useState } from 'react';
import { Button, Modal, Nav } from 'react-bootstrap';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Group from './pages/Group.js';
import LogIn from './pages/LogIn.js';
import SignUp from './pages/SignUp.js';
import MainPage from './pages/MainPage.js';
axios.defaults.withCredentials = true;

function App() {
  //let state = useSelector((state) => state )

  let [missionList, setMissionList] = useState([]);
  let [groupList] = useState(['그지깽깽이들', '그만 좀 먹어라', '예쁜말 고운말']);
  let [join, setJoin] = useState(false);
  let [create, setCreate] = useState(false);
  const [newMission, setNewMission] = useState('');

  let [userName, setUserName] = useState();
  let [point, setPoint] = useState();
  let [missionInput, setMissionInput] = useState('');
  let [tap, setTap] = useState(0);
  let navigate = useNavigate();
  let [userCount] = useState(32)
  
  useEffect(() => {
    axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/GetInfo.php')
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
      <Routes>
        <Route path="/" element={ <MainPage userName={userName} point={point} navigate={navigate} missionList={missionList} setMissionList={setMissionList} groupList={groupList} create={create} setCreate={setCreate} join={join} setJoin={setJoin}/> }/>
        <Route path="/login" element={ <LogIn userCount={userCount} navigate={navigate}/> }/>
        <Route path="/signup" element={ <SignUp/> }/>
        <Route path="/group" element={ <Group/> }/>
        <Route path="*" element={<div>404</div>}/>
      </Routes>
    </div>
  );
}

export default App;