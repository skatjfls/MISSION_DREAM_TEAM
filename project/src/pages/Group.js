import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
import React, { useState, useEffect } from 'react';
import { Nav, Modal, Button, Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './Group.css';
import Group from './Group.js';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
axios.defaults.withCredentials = true;

function App() {
  let [userName, setUserName] = useState(); //로그인된 이름
  let [point, setPoint] = useState(); //로그인된 포인트
  const [groupName, setGroupName] = useState(""); // 로그인된 사람의 그룹 이름
  const [penaltyPerPoint, setPenaltyPerPoint] = useState(0); // 빈 배열 대신 0으로 초기화
  let [groupmember, setGroupMemberList] = useState([]); //로그인된 사람이 포함된 그룹내 멤버 리스트
  const [isLoggerIn, setIsLoggedIN] = useState(false); //로그인됐나

  // fetchGroupName 함수에서 groupName으로 설정
  const fetchGroupName = async () => {
    try {
        const res = await axios.get(`http://localhost/MISSION_DREAM_TEAM/PHP/ShowGroup.php?`);
        if (res.data.length > 0) {
          const groupName = res.data[0].group_name; // 그룹 이름을 가져옴
          setGroupName(groupName); // groupName 설정
          console.log('그룹이름', groupName);
        }
    } catch (error) {
        console.error('Error fetching missions:', error);
    }
  };

  //포인트랑 원 환산 가져오기
  const fetchPenaltyPerPoint = async () => {
    try {
        const res = await axios.get(`http://localhost/MISSION_DREAM_TEAM/PHP/Show_cost_settlement.php`);
        if(res.data.length > 0){
          console.log("포인트 배열", res.data);
          const penaltyPerPoint = res.penalty_per_point; // 벌금 단위를 가져옴
          setPenaltyPerPoint(penaltyPerPoint);
          console.log("포인트 환산", penaltyPerPoint);
        }
    } catch (error) {
        console.error('에러 fetching penalty per point:', error);
    }
  };
  
  // //포인트랑 원 환산 가져오기
  // const fetchPenaltyPerPoint = async () => {
  //   try {
  //       const res = await axios.get(`http://localhost/MISSION_DREAM_TEAM/PHP/Show_cost_settlement.php`);
  //       if(res.data.length > 0){
  //         console.log("포인트 배열", res.data);
  //         const penaltyPerPoint = res.penalty_per_point; // 벌금 단위를 가져옴
  //         setPenaltyPerPoint(penaltyPerPoint);
  //         console.log("포인트 환산", penaltyPerPoint);
  //       }
  //   } catch (error) {
  //       console.error('에러 fetching penalty per point:', error);
  //   }
  // };
  

  useEffect(() => {
    fetchPenaltyPerPoint();
  }, []);
  


  //세션확인
  useEffect(() => {
    axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/CheckLoginState.php')
    .then(res => {
      console.log('로그인 상태 : ',res);
      if(res.data === 'true'){
        setIsLoggedIN(true);
      }else{
        setIsLoggedIN(false);
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error)
    })
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/GetInfo.php');
        console.log(res);
        const userData = res.data;
        setUserName(userData.name);
        setPoint(userData.point);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  });

  //캘린더
  let [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  let [showModal, setShowModal] = useState(false);
  let navigate = useNavigate();

  let [members, setMembers] = useState([]);
  useEffect(() => {
    fetchGroupName();
  }, []);

  let startOfWeek = new Date(currentWeekStart);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  let endOfWeek = new Date(currentWeekStart);
  endOfWeek.setDate(endOfWeek.getDate() - endOfWeek.getDay() + 7);

  let daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
  let datesOfWeek = [];
  for (let i = 0; i < 7; i++) {
    let date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    datesOfWeek.push(date);
  };

  // 수정된 부분: PointWon 대신에 penalty_per_point 사용
  let penalty_per_point = 4000;
  
  let prevPoint = Number.POSITIVE_INFINITY;
  let rank = 1;
  let sameRankCount = 0;

  return (
    <div className="Group">
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
                  .then(res => {
                    navigate('/login')
                  })
                  .catch(err => {
                    console.log(err)
                  })
                  }}>로그아웃</button>
              </div>
            </div>
            <div className="content">
                  <div className="info-container">
                    <nav>
                      <div className="calculate" onClick={() => setShowModal(true)}>포인트 정산하기</div>
                      <div className="members">
                      <div className="infoMember">멤버</div>
                        {members.map((member, index) => (
                            renderMember(member, index, (index) => setMembers(prevMembers => toggleMissionList(prevMembers, index)))
                          ))}
                      </div>
                      <p className="groupExit">그룹 탈퇴하기</p>
                      <div className="handle"></div>
                    </nav>
                  </div>
                  <div className="groupCalendar-container">
                    <div className="groupCalendar">
                      <div className="groupInfo">
                        <table className="table-bordered groupInfoTable">
                          <tr>
                            <td>
                            <div className="groupName">{groupName}</div>
                            </td>
                            <td>
                            <div className="pointWon">1 pt = {penaltyPerPoint} 원</div>
                            </td>
                            <td style={{ width: '700px' }}></td>
                            <td>
                            <div className="groupOption">설정</div>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <div className="groupNotice">공지</div>
                      <table className="table-bordered groupStats">
                        <thead>
                          <tr>
                            <th></th>
                            <th colSpan="7">
                              <button className="backOfWeek" onClick={() => handleBackOfWeekClick(currentWeekStart, setCurrentWeekStart)}>◀</button>
                              <h>{startOfWeek.getMonth() + 1}/{startOfWeek.getDate()} ~ {endOfWeek.getMonth() + 1}/{endOfWeek.getDate()}</h>
                              <button className="frontOfWeek" onClick={() => handleFrontOfWeekClick(currentWeekStart, setCurrentWeekStart)}>▶</button>
                            </th>
                          </tr>
                          <tr>
                            <th></th>
                            {daysOfWeek.map((day, index) => (
                              <th key={index}>{day}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td></td>
                            {datesOfWeek.map((date, index) => (
                              <td key={index}>{date.getDate()}</td>
                            ))}
                          </tr>
                          {members.map((member, memberIndex) => (
                            <tr key={memberIndex} >
                              <td style={{ width: '200px' }}>{member.memberName}</td>
                              {datesOfWeek.map((date, dateIndex) => (
                                <td key={dateIndex} style={{ width: '100px' }}>
                                  {date.toDateString() === new Date().toDateString() ? member.memberPoint : ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
            </div>
          </div>
        }/>
        <Route path="/login" element={<LogIn navigate={navigate}/>}/>
        <Route path="/signup" element={ <SignUp/> }/>
        <Route path="/group" element={ <Group/> }/>
        <Route path="*" element={<div>404</div>}/>
      </Routes>
      <PointModal showModal={showModal} setShowModal={setShowModal} members={members} penalty_per_point={penalty_per_point} />
    </div>
  );
}

function generateMembers() {
  let newMembers = [];
  for (let i = 1; i <= 10; i++) {
    let memberAchieve = `${Math.floor(Math.random() * 10)}/10`;
    let memberPoint = `${-(10 - parseInt(memberAchieve.split('/')[0]))}pt`;
    let missionList = [];
    let numberOfMissions = Math.floor(Math.random() * 6) + 5;
    
    for (let j = 1; j < numberOfMissions; j++) {
      let numberOfAlphabets = Math.floor(Math.random() * 5);
      let mission = '';
      for (let k = 0; k < numberOfAlphabets; k++) {
        mission += String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
      missionList.push(mission);
    }

    newMembers.push({
      memberProfileImage: `사진${i}`,
      memberName: `멤버${i}`,
      memberAchieve: memberAchieve,
      memberPoint: memberPoint,
      memberMissionList: missionList,
      showMissionList: false
    });
  }
  return newMembers;
}

function toggleMissionList(prevMembers, index) {
  return prevMembers.map((member, i) =>
    i === index ? { ...member, showMissionList: !member.showMissionList } : member
  );
}

function handleBackOfWeekClick(currentWeekStart, setCurrentWeekStart) {
  let prevWeekStart = new Date(currentWeekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  setCurrentWeekStart(prevWeekStart);
}

function handleFrontOfWeekClick(currentWeekStart, setCurrentWeekStart) {
  let nextWeekStart = new Date(currentWeekStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  setCurrentWeekStart(nextWeekStart);
}

function renderMember(member, index, toggleMissionList) {
  return (
    <div className="member" key={index} onClick={() => toggleMissionList(index)}>
      <span className="memberProfileImage">{member.memberProfileImage} </span>
      <span className="memberName">{member.memberName} </span>
      <span className="memberAchieve">{member.memberAchieve} </span>
      <span className="memberPoint">{member.memberPoint} </span>
      {member.showMissionList && (
        <div className="memberMissionList">
          {member.memberMissionList.map((mission, missionIndex) => (
            <div key={missionIndex}>{mission}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function PointModal({ showModal, setShowModal, members, penalty_per_point }) {
  let prevPoint = Number.POSITIVE_INFINITY;
  let rank = 1;
  let sameRankCount = 0;

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>이번 정산 결과는?</Modal.Title>
        <Modal.Dialog>1pt={penalty_per_point}원</Modal.Dialog>
      </Modal.Header>
      <Modal.Body>
        <p>tip. 이번에는 꼴찌가 1등에게 정산금을 몰아주는건 어떨까요?</p>
        {members
          .map((member, index) => ({
            ...member,
            calculatedPoint: Math.abs(parseInt(member.memberPoint)) * penalty_per_point
          }))
          .sort((a, b) => {
            if (a.calculatedPoint === b.calculatedPoint) {
              return a.memberName.localeCompare(b.memberName);
            }
            return a.calculatedPoint - b.calculatedPoint;
          })
          .map((member, index) => {
            if (prevPoint !== member.calculatedPoint) {
              rank += sameRankCount;
              sameRankCount = 1;
            } else {
              sameRankCount++;
            }
            prevPoint = member.calculatedPoint;

            return (
              <p key={index}>
                {rank}등: {member.memberName}: {member.memberPoint} X {penalty_per_point} = -{member.calculatedPoint}
              </p>
            );
          })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default App;
