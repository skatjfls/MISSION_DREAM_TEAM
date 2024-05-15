import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './Group.css';
import Group from './Group.js';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
axios.defaults.withCredentials = true;

function GroupPage(props) {

  const location = useLocation();
  const selectGroup = location.state.pageGroupName;

  let [userName, setUserName] = useState(); //로그인된 이름
  let [point, setPoint] = useState(); //로그인된 포인트
  const [groupName, setGroupName] = useState(""); // 로그인된 사람의 그룹 이름
  const [groupMemberList, setGroupMemberList] = useState([]);
  const [penaltyPerPoint, setPenaltyPerPoint] = useState(0); // 빈 배열 대신 0으로 초기화
  const [isLoggerIn, setIsLoggedIN] = useState(false); //로그인됐나
  let [groupList, setGroupList] = useState([]);
  let [members, setMembers] = useState([]); // 여기서 members 상태 정의


  useEffect(() => {
    console.log("선택된 그룹", selectGroup)
    fetchGroupMemberList(selectGroup, setMembers);
    console.log("멤버",members)
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

  
  //그룹리스트를 배열로 php에 넘겨주기

  // //포인트랑 원 환산 가져오기@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
  
  //캘린더
  let [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  let [showModal, setShowModal] = useState(false);
  let navigate = useNavigate();  

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
                          <div>
                          {Array.isArray(members) ? (
                            <div className="members">
                              {
                                members.map((member, index) => (
                                  console.log('멤버', JSON.parse(member)),
                                  member = JSON.parse(member),
                                  <div key={index} className="member">
                                    <h6>{member['id']}</h6>
                                    <h6>{member['name']}</h6>
                                    <h6>{member['missionNotCompleteCount']}/{member['missionTotalCount']}</h6>
                                    {
                                      member['missionList'].map((mission, index) => (
                                        mission = JSON.parse(mission),
                                        <h6>{mission['mission']}</h6>
                                      ))
                                    }
                                  </div>
                                ))
                              }
                          </div>
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
                          <tr>
                            <td>
                            <div className="groupName"></div>
                            {
                              groupList.length > 0 && groupList.map(function(content, i){
                                const groupPrice = content.penaltyPerPoint.PenaltyPerPoint
                                const returnString = groupPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                return (
                                  <div className="groupList" key={i}>
                                    <span className='myGroupPrice'>{ '₩'+returnString }</span>
                                    <div className="myGroupName" onClick={()=>{ props.navigate('/group')}}>{ content.groupName.group_name }</div>
                                  </div>
                                )
                              })
                            }
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

//그룹에 있는 멤버 불러오기
const fetchGroupMemberList = async (selectGroup, setMembers) => {
  try {
    const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ShowGroupMemberInfo.php',{
    groupName : selectGroup}
  );
    console.log('그룹 정보', res);

    setMembers(res.data); // members 상태를 설정합니다.
  } catch (error) {
    console.error('그룹멤버', error)
  }
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


