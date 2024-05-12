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
<<<<<<< Updated upstream
      <Routes>
        <Route path="/" element={
          <div>
            <div className="nav-bar">
              <img className="img-logo" onClick={()=>{navigate('/')}} src="/img/dream.png"/>
              <div>
                <h6>{ userName }</h6>
                <h6>{ point } point</h6>
                <img className="imgs" src="/img/gear.png"/>
                <button className="button-logout" onClick={()=>{
                  axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/LogOut.php')
                  .then((res) => {
                    console.log(res)
                    alert('로그아웃되었습니다.')
                    navigate('/login')
                  })
                  .catch((err) => {
                    console.log(err)
                  })
                  }}>로그아웃</button>
              </div>
            </div>
            <div className="main-top">
              {
                tap == 0? <>
                  <h1>To do list</h1>
                  <input className="input-todo" type="text" value={missionInput} onChange={(e)=>{ setMissionInput(e.target.value) }}placeholder="오늘의 할 일을 작성하세요!"></input>
                  <button className="button-todo-plus" onClick={handleAddMission}>+</button>
                </> : <h1>Calendar</h1>
              }
              <Nav variant="tabs" defaultActiveKey="todo" className="tap">
                <Nav.Item>
                  <Nav.Link onClick={()=>{ setTap(0) }} eventKey="todo">to do</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onClick={()=>{ setTap(1) }} eventKey="calendar">calendar</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            {
              tap == 0 ? <ToDo setCreate={setCreate} setJoin={setJoin} groupList={groupList} missionList={missionList} setMissionList={setMissionList} navigate={navigate} newMission={newMission} setNewMission={setNewMission}/> : null
            }
            {
              tap == 1 ? <MyCalendar/> : null
            }
          </div>
        }/>
        <Route path="/login" element={ <LogIn userCount={userCount} navigate={navigate}/> }/>
        <Route path="/signup" element={ <SignUp/> }/>
        <Route path="/group" element={ <Group/> }/>
        <Route path="*" element={<div>404</div>}/>
      </Routes>
      <CreateGroup create={create} setCreate={setCreate}/>
      <JoinGroup join={join} setJoin={setJoin}/>
=======
      <UserProvider>
        <Routes>
          <Route path="/" element={<MainPage userName={userName} point={point} navigate={navigate}/>}/>
          <Route path="/login" element={ <LogIn userCount={userCount} navigate={navigate}/> }/>
          <Route path="/signup" element={ <SignUp/> }/>
          <Route path="/group" element={ <Group/> }/>
          <Route path="*" element={<div>404</div>}/>
        </Routes>
      </UserProvider>
>>>>>>> Stashed changes
    </div>
  );
}

export default App;