import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Group from './pages/Group.js';
import LogIn from './pages/LogIn.js';
import SignUp from './pages/SignUp.js';


function App() {
  
  let [missionList, setMissionList] = useState(['5,000원만 쓰기', '6,000원만 쓰기', '7,000원만 쓰기']);
  let [groupList] = useState(['그지깽깽이들', '그만 좀 먹어라', '예쁜말 고운말']);
  let [join, setJoin] = useState(false);
  let [create, setCreate] = useState(false);

  let [userName] = useState('이지민');
  let [point] = useState(-2);
  let [missionInput, setMissionInput] = useState('');
  let [tap, setTap] = useState(0);
  let navigate = useNavigate();
  let [userCount] = useState(32)

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <div>
            <div className="nav-bar">
              <h4 onClick={()=>{navigate('/')}}>미션드림팀 로고</h4>
              <div>
                <h6>{ userName }</h6>
                <h6>{ point } point</h6>
                <button>O</button>
                <button onClick={()=>{navigate('/login')}}>로그아웃</button>
              </div>
            </div>
            {
              create === true ? <CreateGroup setCreate={setCreate}/> : null
            }
            {
              join === true ? <JoinGroup setJoin={setJoin}/> : null
            }
            <div className="main-top">
              <h1>To do list</h1>
              {
                tap == 0? <>
                  <input type="text" onChange={(e)=>{ setMissionInput(e.target.value) }}placeholder="오늘의 할 일을 작성하세요!"></input>
                  <button onClick={()=>{ if (missionInput.trim() !== "") {let copy = [...missionList]; copy.push(missionInput); setMissionList(copy);} }}>+</button>
                </> : null
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
              tap == 0 ? <ToDo setCreate={setCreate} setJoin={setJoin} groupList={groupList} missionList={missionList} setMissionList={setMissionList} navigate={navigate}/> : null
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
    </div>
  );
}

function ToDo(props) {
  return(
    <div className="todo">
      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          {
            props.missionList.map(function(content, i){
              return (
                <div className="mission" key={i}>
                  <input type="checkbox"/>
                  <h6 id={ content }>{ content }</h6>
                  <button>샷</button>
                  <button onClick={()=>{ let copy = [...props.missionList]; copy.splice(i, 1); props.setMissionList(copy); }}>X</button>
                </div>
              )
            })
          }
        </div>
        <div className="col-md-4">
          <div className="myGroup">
            <div className="myGroup-top">
              <h4>나의 그룹</h4>
              <button onClick={()=>{ props.setCreate(true) }}>+</button>
            </div>
            {
              props.groupList.map(function(content, i){
                return (
                  <div className="groupList" key={i}>
                    <h6 onClick={()=>{ props.navigate('/group')}}>{ content }</h6>
                  </div>
                )
              })
            }
            <button onClick={()=>{ props.setJoin(true) }}>그룹 가입하기</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MyCalendar() {
  
}

function CreateGroup(props) {
  return (
    <div className="myModal">
      <button onClick={()=>{ props.setCreate(false) }}>X</button>
      <h2>그룹 생성</h2>
      <h4>그룹 이름</h4>
      <input type="text" placeholder="그룹 이름을 작성해주세요!"></input>
      <h4>포인트 별 금액</h4>
      <span>₩0</span><span>₩500</span><span>₩1,000</span><span>₩2,000</span><span>₩3,000</span><span>₩5,000</span>
      <p>동기부여를 위해 포인트별 금액을 설정해보세요! 벌금처럼 걷어서 회식이나 1/n을 해도 좋고, 꼴등이 1등에게 쏘기도 좋아요!</p>
      <p>벌금이 부담스럽다면 0원으로 설정 후 상벌을 정해보세요.</p>
      <h4>그룹 공지사항</h4>
      <textarea placeholder="그룹 내에서 지켜야 할 규칙을 작성해주세요."></textarea>
      <h4>입장 비밀번호</h4>
      <input type="password" placeholder="비밀번호를 숫자로 작성해주세요!"></input>
      <button>취소</button>
      <button>그룹 만들기</button>
    </div>
  );
}

function JoinGroup(props) {
  return (
    <div className="myModal">
      <button onClick={()=>{ props.setJoin(false) }}>X</button>
      <h2>그룹 가입</h2>
      <input type="text" placeholder="그룹 이름"></input>
      <input type="password" placeholder="비밀번호"></input>
      <button>그룹 가입하기</button>
    </div>
  );
}

export default App;