import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
import React, { useState, useEffect } from 'react';
import { Nav, Modal, Button, Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import './Group.css';
import Group from './Group.js';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
axios.defaults.withCredentials = true;

function GroupPage(props) {
  let [userName, setUserName] = useState(); //로그인된 이름
  let [point, setPoint] = useState(); //로그인된 포인트
  const location = useLocation();
  const group_name = location.state.pageGroupName; //app.js에서 받아오게 되면 여기다가 넣기
  const [penaltyPerPoint, setPenaltyPerPoint] = useState(0); // 빈 배열 대신 0으로 초기화
  const [isLoggerIn, setIsLoggedIN] = useState(false); //로그인됐나
  const [members, setMembers] = useState([]); // 여기서 members 상태 정의
  const [membersPoint, setMembersPoint] = useState([]); //멤버별 개인 포인트

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
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/GetInfo.php');
        const userData = res.data;
        setUserName(userData.name);
        const string = '-'+userData.noMissionCnt;
        setPoint(string);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  });

//포인트랑 원 환산 가져오기
const fetchPenaltyPerPoint = async () => {
  try {
    const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ShowPenalty.php', { groupName: group_name });
    const bringpenaltyPerPoint = res.data; // 벌점 당 포인트 가져 오기
    setPenaltyPerPoint(bringpenaltyPerPoint); // 상태에 벌점 당 포인트 설정
    console.log("그룹 포인트:", bringpenaltyPerPoint);
  } catch (error) {
    console.error('에러 fetching penalty per point:', error);
  }
};


useEffect(() => {
  fetchPenaltyPerPoint(setPenaltyPerPoint);
}, []);

  
//그룹에 있는 멤버 불러오기
const fetchGroupMemberList = async () => {
  try {
    const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ShowGroupMemberInfo.php', { groupName: group_name });
    console.log('그룹멤버 성공', res);
    setMembers(res.data); // members 상태를 설정합니다.
  } catch (error) {
    console.error('그룹멤버 실패', error)
  }
}

//멤버별 포인트 불러오기
const fetchGroupMemberPoint = async () => {
  try {
    const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ShowGroupMemberPoint.php', { groupName: group_name });
    console.log('포인트불러오기ㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣ', res.data);
    setMembersPoint(res.data); // 멤버 포인트를 상태에 설정합니다.
  } catch (error) {
    console.error('불러오기 실패', error);
  }
};


useEffect(() => {
fetchGroupMemberPoint(setMembersPoint);
}, []);
  

  //캘린더
  let [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  let [showModal, setShowModal] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    fetchGroupMemberList(group_name); 
  }, [group_name]); // groupName이 변경될 때마다 실행됩니다.
  
  

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
                    <div>
                    {Array.isArray(members) ? (
                      members.map((member, index) => {
                        // member를 파싱하여 각 키에 대한 변수 만들기
                        const memberObject = JSON.parse(member);
                        const id = memberObject.id;
                        const name = memberObject.name;
                        const missionList = memberObject.missionList;
                        const missionTotalCount = memberObject.missionTotalCount;
                        const missionNotCompleteCount = memberObject.missionNotCompleteCount;
                        const error = memberObject.error;
                        let missionComplete; // missionComplete 변수를 미리 선언

                        return (
                          <div key={index} className="member">
                            {/* 각 변수를 사용하여 출력 */}
                            <span>
                              {name},  
                              {missionTotalCount - missionNotCompleteCount}/{missionTotalCount},  
                              {missionNotCompleteCount}pt
                            </span>
                            <table className="missionTable">
                              <thead>
                                <tr>
                                  <th>달성</th>
                                  <th>미션</th>
                                  <th>인증</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* missionList를 반복하여 각 미션을 출력 */}
                                {missionList.map((mission, missionIndex) => {
                                  const missionObject = JSON.parse(mission);
                                  missionComplete = missionObject.complete; // missionComplete 변수에 값 할당
                                  const missionName = missionObject.mission;
                                  const missionPhoto = missionObject.photo;
                                  return (
                                    <tr key={missionIndex}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={missionComplete === 1 ? true : false}
                                          disabled
                                        />
                                      </td>
                                      <td>{missionName}</td>
                                      <td>{missionPhoto}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        );
                      })
                    ) : (
                      <p>Members is not an array</p>
                    )}

                        </div>
                      </div>
                      <p className="groupExit">그룹 탈퇴하기</p>
                      <div className="handle"></div>
                    </nav>
                  </div>
                  <div className="groupCalendar-container">
                    <div className="groupCalendar">
                      <div className="groupInfo">
                      <table className="table-bordered groupInfoTable">
                        <thead>
                          <tr>
                            <td>
                              <div className="groupName"></div>
                              {group_name}
                            </td>
                            <td>
                              <div className="penaltyPerPoint">1 pt = {penaltyPerPoint} 원</div>
                            </td>
                            <td style={{ width: '700px' }}></td>
                            <td>
                              <div className="groupOption">설정</div>
                            </td>
                          </tr>
                        </thead>
                      </table>

                      </div>
                      <div className="groupNotice">공지</div>
                      <table className="table-bordered groupStats">
                        <thead>
                          <tr>
                            <th></th>
                            <th colSpan="7">
                              <button className="backOfWeek" onClick={() => handleBackOfWeekClick(currentWeekStart, setCurrentWeekStart)}>◀</button>
                              <b>{startOfWeek.getMonth() + 1}/{startOfWeek.getDate()} ~ {endOfWeek.getMonth() + 1}/{endOfWeek.getDate()}</b>
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
                          {Array.isArray(members) ? (
                            members.map((member, index) => {
                              // member를 파싱하여 각 키에 대한 변수 만들기
                              const memberObject = JSON.parse(member);
                              const name = memberObject.name;
                              return (
                                <tr key={index}>
                                  <td style={{ width: '200px' }}>{name}</td>
                                  {datesOfWeek.map((date, dateIndex) => (
                                    <td key={dateIndex} style={{ width: '100px' }}>
                                      {date.toDateString() === new Date().toDateString() ? member.memberPoint : ''}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={8}>Members is not an array</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
            </div>
          </div>
        }/>
      </Routes>
      <PointModal showModal={showModal} setShowModal={setShowModal} members={members}  /> 
    </div> // PointModal에 penalty_per_point={penalty_per_point} 넣기
  );
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

export default GroupPage;

