import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
import React, { useState, useEffect } from 'react';
import { Nav, Modal, Button, Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './Group.css';
import Group from './Group.js';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';

import 'react-calendar/dist/Calendar.css';

function App() {
  let [userName] = useState('이지민');
  let [point] = useState(-2);
  let [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  let [showModal, setShowModal] = useState(false);
  let navigate = useNavigate();

  let [members, setMembers] = useState([]);
  useEffect(() => {
    setMembers(generateMembers());
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

  let PointWon=4000;
  
  let prevPoint = Number.POSITIVE_INFINITY;
  let rank = 1;
  let sameRankCount = 0;

  return (
    <div className="Group">
      <Routes>
        <Route path="/" element={
          <div>
            <div className="nav-bar">
              <h4 onClick={() => navigate('/')}>미션드림팀 로고</h4>
              <div>
                <h6>{userName}</h6>
                <h6>{point} point</h6>
                <button>O</button>
                <button onClick={() => navigate('/login')}>로그아웃</button>
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
                            <div className="groupName">그지깽깽이들</div>
                            </td>
                            <td>
                            <div className="pointWon">1 pt = {PointWon} 원</div>
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
                            <tr key={memberIndex}>
                              <td>{member.memberName}</td>
                              {datesOfWeek.map((date, dateIndex) => (
                                <td key={dateIndex}>
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
            <div className="row footer">
              <div className="col">footer</div>
            </div>
          </div>
        }/>
        <Route path="/login" element={<LogIn navigate={navigate}/>}/>
        <Route path="/signup" element={ <SignUp/> }/>
        <Route path="/group" element={ <Group/> }/>
        <Route path="*" element={<div>404</div>}/>
      </Routes>
      <PointModal showModal={showModal} setShowModal={setShowModal} members={members} PointWon={PointWon} />
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

function PointModal({ showModal, setShowModal, members, PointWon }) {
  let prevPoint = Number.POSITIVE_INFINITY;
  let rank = 1;
  let sameRankCount = 0;

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>이번 정산 결과는?</Modal.Title>
        <Modal.Dialog>1pt={PointWon}원</Modal.Dialog>
      </Modal.Header>
      <Modal.Body>
        <p>tip. 이번에는 꼴찌가 1등에게 정산금을 몰아주는건 어떨까요?</p>
        {members
          .map((member, index) => ({
            ...member,
            calculatedPoint: Math.abs(parseInt(member.memberPoint)) * PointWon
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
                {rank}등: {member.memberName}: {member.memberPoint} X {PointWon} = -{member.calculatedPoint}
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
