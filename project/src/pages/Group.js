import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './Group.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Modal, Button } from 'react-bootstrap'; // 모달과 버튼을 사용하기 위해 추가
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [userName] = useState('이지민');
  const [point] = useState(-2);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [showModal, setShowModal] = useState(false); // 모달을 보여주는 상태 추가
  const navigate = useNavigate();

  const handleBackOfWeekClick = () => {
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    setCurrentWeekStart(prevWeekStart);
  };

  const handleFrontOfWeekClick = () => {
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeekStart);
  };

  // 멤버 리스트 생성
  const [members, setMembers] = useState([]);
  useEffect(() => {
    const newMembers = [];
    for (let i = 1; i <= 10; i++) {
      const memberAchieve = `${Math.floor(Math.random() * 10)}/10`; // memberAchieve를 정의
      const memberPoint = `${-(10 - parseInt(memberAchieve.split('/')[0]))}pt`; // 연산식을 통해 memberPoint 계산
      // 미션 리스트 생성
      const missionList = [];
      const numberOfMissions = Math.floor(Math.random() * 6) + 5; // 5개 내외의 미션 수 설정
      
      for (let j = 1; j < numberOfMissions; j++) {
        const numberOfAlphabets = Math.floor(Math.random() * 5); // A부터 Z까지의 알파벳 랜덤 개수 설정
        let mission = '';
        for (let k = 0; k < numberOfAlphabets; k++) {
          mission += String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A부터 Z까지의 알파벳 추가
        }
        missionList.push(mission);
      }

      newMembers.push({
        memberProfileImage: `사진${i}`,
        memberName: `멤버${i}`,
        memberAchieve: memberAchieve,
        memberPoint: memberPoint,
        memberMissionList: missionList, // 미션 리스트 추가
        showMissionList: false // 초기에는 미션 리스트를 보이지 않도록 설정
      });
    }
    setMembers(newMembers);
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행되도록 빈 배열을 전달

  // 이번 주의 날짜를 계산
  const startOfWeek = new Date(currentWeekStart);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  const endOfWeek = new Date(currentWeekStart);
  endOfWeek.setDate(endOfWeek.getDate() - endOfWeek.getDay() + 7);

  // 이번 주의 요일 배열 생성
  const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
  const datesOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    datesOfWeek.push(date);
  }

  // 멤버의 미션 리스트를 토글하는 함수
  const toggleMissionList = (index) => {
    setMembers((prevMembers) =>
      prevMembers.map((member, i) =>
        i === index ? { ...member, showMissionList: !member.showMissionList } : member
      )
    );
  };

  const PointWon=4000;

// 이전 멤버의 포인트를 기억할 변수 선언
let prevPoint = Number.POSITIVE_INFINITY;
let rank = 1; // 시작 등수는 1로 설정
let sameRankCount = 0; // 등수가 같은 사람의 수를 기억할 변수

  return (
    <div className="container-fluid">
      <div className="nav-bar">
        <h4 onClick={() => navigate('/')}>미션드림팀 로고</h4>
        <div>
          <h6>{userName}</h6>
          <h6>{point} point</h6>
          <button>O</button>
          <button onClick={() => navigate('/login')}>로그아웃</button>
        </div>
      </div>
      <div className="row content">
        <div className="col-3 info">
          <nav>
            <div className="PointWon">1pt={PointWon}원</div>
            <div className="calculate" onClick={() => setShowModal(true)}>포인트 정산하기</div> {/* 모달 열기 */}
            <div className="members">
              <p>멤버</p>
              {members.map((member, index) => (
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
              ))}
            </div>
            <p className="groupExit">그룹 탈퇴하기</p>
          </nav>
        </div>
        <div className="col groupCalender">
          <table className="table-bordered">
            <thead>
              <tr>
                <th></th> {/* 월 앞에 추가된 열 */}
                <th colSpan="7">
                  <button className="backOfWeek" onClick={handleBackOfWeekClick}>◀</button>
                  <h>{startOfWeek.getMonth() + 1}/{startOfWeek.getDate()} ~ {endOfWeek.getMonth() + 1}/{endOfWeek.getDate()}</h>
                  <button className="frontOfWeek" onClick={handleFrontOfWeekClick}>▶</button>
                </th>
              </tr>
              <tr>
                <th></th> {/* 월 앞에 추가된 열 */}
                {daysOfWeek.map((day, index) => (
                  <th key={index}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td> {/* 월 앞에 추가된 열 */}
                {datesOfWeek.map((date, index) => (
                  <td key={index}>{date.getDate()}</td>
                ))}
              </tr>
              {/* 모든 멤버에 대해 행을 추가 */}
              {members.map((member, memberIndex) => (
                <tr key={memberIndex}>
                  <td>{member.memberName}</td>
                  {/* 각 날짜에 대해 포인트 표시 */}
                  {datesOfWeek.map((date, dateIndex) => (
                    <td key={dateIndex}>
                      {/* 오늘의 날짜이면 해당 멤버의 포인트를 표시 */}
                      {date.toDateString() === new Date().toDateString() ? member.memberPoint : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Calendar minDate={startOfWeek} maxDate={endOfWeek} />
        </div>
      </div>
      <div className="row footer">
        <div className="col">footer</div>
      </div>

      {/* 포인트 정산 모달 */}
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
      // 포인트가 같은 경우 이름을 기준으로 정렬
      return a.memberName.localeCompare(b.memberName);
    }
    // 포인트가 다른 경우 포인트를 기준으로 정렬
    return a.calculatedPoint - b.calculatedPoint;
  })
  .map((member, index) => {
    // 이전 멤버의 포인트와 다른 경우 등수를 1 증가시킴
    if (prevPoint !== member.calculatedPoint) {
      rank += sameRankCount; // 등수가 같은 사람의 수만큼 등수를 증가
      sameRankCount = 1; // 현재 멤버를 포함하여 1로 설정
    } else {
      sameRankCount++; // 등수가 같은 경우 카운트 증가
    }
    // 이전 멤버의 포인트 업데이트
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
    </div>
  );
}

export default App;
