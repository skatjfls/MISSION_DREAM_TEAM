import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import 'react-calendar/dist/Calendar.css';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import './Group.css';

axios.defaults.withCredentials = true;

function GroupPage(props) {
    let [userName, setUserName] = useState(); // 로그인된 이름
    let [point, setPoint] = useState(); // 로그인된 포인트
    const location = useLocation();
    const group_name = location.state.pageGroupName; // app.js에서 받아오게 되면 여기다가 넣기
    const [penaltyPerPoint, setPenaltyPerPoint] = useState(0); // 빈 배열 대신 0으로 초기화
    const [isLoggerIn, setIsLoggedIN] = useState(false); // 로그인됐나
    const [members, setMembers] = useState([]); // 여기서 members 상태 정의
    const [membersOverall, setMembersOverall] = useState({}); // 멤버별 개인 날짜별 포인트를 객체로 초기화
    const [memberMissionTables, setMemberMissionTables] = useState({}); // 클릭한 멤버의 미션 테이블 표시 상태를 관리하는 객체
    const [showSettingModal, setShowSettingModal] = useState(false); // 설정 모달 상태

    // 세션확인 및 유저 정보 가져오기
    useEffect(() => {
        const checkLoginState = async () => {
            try {
                const res = await axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/CheckLoginState.php');
                console.log('로그인 상태 : ', res);
                if (res.data === 'true') {
                    setIsLoggedIN(true);
                } else {
                    setIsLoggedIN(false);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        const fetchUserInfo = async () => {
            try {
                const res = await axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/GetInfo.php');
                const userData = res.data;
                setUserName(userData.name);
                const string = '-' + userData.noMissionCnt;
                setPoint(string);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        checkLoginState();
        fetchUserInfo();
    }, []);

    // penaltyperpoint 가져오기
    useEffect(() => {
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
        fetchPenaltyPerPoint();
    }, [group_name]);

    // 그룹 공지 가져오기
    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ShowNotice.php', { groupName: group_name });
                const notice = res.data; // 공지 가져오기
                // 가져온 공지를 그룹 공지 위치에 넣기
                const groupNoticeElement = document.querySelector('.groupNotice');
                if (groupNoticeElement) {
                    groupNoticeElement.innerText = notice;
                }
                console.log("그룹 공지:", notice);
            } catch (error) {
                console.error('에러 fetching notice:', error);
            }
        };
        fetchNotice();
    }, [group_name]);


    // 그룹에 있는 멤버 정보 가져오기
    useEffect(() => {
        const fetchGroupMemberList = async () => {
            try {
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ShowGroupMemberInfo.php', { groupName: group_name });
                console.log('그룹멤버 성공', res);
                setMembers(res.data);
            } catch (error) {
                console.error('그룹멤버 실패', error);
            }
        };

        // fetchGroupMemberOverall 함수 내부 수정
        const fetchGroupMemberOverall = async () => {
            try {
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ShowGroupMemberPoint.php', { groupName: group_name });
                console.log('포인트 불러오기 성공', res.data);

                const pointsByDate = {};
                res.data.forEach(member => {
                    const memberId = member.id;
                    console.log(`Processing member ID: ${memberId}`);
                    const memberPoints = member.point;
                    
                    Object.keys(memberPoints).forEach(date => {
                        if (date !== "") {
                            const formattedDate = moment(date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
                            if (!pointsByDate[formattedDate]) {
                                pointsByDate[formattedDate] = {};
                            }
                            pointsByDate[formattedDate][memberId] = memberPoints[date];
                        } else {
                            // 빈 문자열인 경우 어제의 날짜를 가져와서 해당 값을 어제의 날짜로 설정
                            const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
                            if (!pointsByDate[yesterday]) {
                                pointsByDate[yesterday] = {};
                            }
                            // 어제의 날짜에 해당 값을 설정
                            pointsByDate[yesterday][memberId] = memberPoints[""];
                        }
                    });
                });

                console.log('membersOverall:', pointsByDate);
                setMembersOverall(pointsByDate);
            } catch (error) {
                console.error('포인트 불러오기 실패', error);
            }
        }

        fetchGroupMemberList();
        fetchGroupMemberOverall();
    }, [group_name]);

    // 그룹 탈퇴
    const handleGroupExit = async () => {
        const confirmed = window.confirm("진짜 탈퇴할거에요?진짜?ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ가지마세용");
        if (confirmed) {
            try {
                await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ExitGroup.php', { groupName: group_name });
                alert("탈퇴 성공..... 메인페이지로 이동할게요....");
                // 메인 페이지로 이동
                navigate('/');
            } catch (err) {
                console.error('그룹 탈퇴 실패!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:', err);
            }
        } else {
            // 아니오를 클릭한 경우 그냥 무시
            console.log("탈퇴안해줄거지롱");
        }
    };

    // 클릭한 멤버의 미션 테이블 표시 상태를 토글하는 함수
    const toggleMissionTable = (memberId) => {
        setMemberMissionTables(prevState => ({
            ...prevState,
            [memberId]: !prevState[memberId]
        }));
    };

    // 그룹 설정 모달 열기
    const handleSettingModalOpen = () => {
        setShowSettingModal(true);
    };
    

    // 캘린더
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

    let prevPoint = Number.POSITIVE_INFINITY;
    let rank = 1;
    let sameRankCount = 0;

    return (
        <div className="Group">
            <Routes>
                <Route path="/" element={
                    <div>
                        <div className="nav-bar">
                            <img className="img-logo" onClick={() => { navigate('/') }} src="/img/dream.png" />
                            <div>
                                <h6>{userName}</h6>
                                <h6>{point} point</h6>
                                <img className="imgs" src="/img/gear.png" />
                                <button className="button-logout" onClick={() => {
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
                                                    const missionTotalPoint = memberObject.missionTotalPoint;
                                                    const error = memberObject.error;
                                                    let missionComplete; // missionComplete 변수를 미리 선언
                                                    return (
                                                        <div key={index} className="member" onClick={() => toggleMissionTable(id)}>
                                                            <span>
                                                                <table className="memberInfo">
                                                                    <thead>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>{name}</td>
                                                                            <td>{missionTotalCount - missionNotCompleteCount}/{missionTotalCount}</td>
                                                                            <td>{missionTotalPoint}pt</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </span>
                                                            {memberMissionTables[id] && (
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
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p>Members is not an array</p>
                                            )}

                                        </div>
                                    </div>
                                    <div className="groupExit">
                                        <button className="button-exit" onClick={handleGroupExit}>그룹 탈퇴하기</button>
                                    </div>
                                    <div className="handle"></div>
                                </nav>
                            </div>
                            <div className="groupCalendar-container">
                                <div className="groupCalendar">
                                    <div className="groupInfo">
                                        <table className="groupInfoTable">
                                            <thead>
                                                <tr>
                                                    <td>
                                                        <div className="groupName">{group_name}</div>
                                                    </td>
                                                    <td>
                                                        <div className="penaltyPerPoint">1 pt = {penaltyPerPoint} 원</div>
                                                    </td>
                                                    <td style={{ width: '500px' }}></td>
                                                    <td>
                                                        <div className="groupOption" variant="primary" onClick={handleSettingModalOpen}><img className="imgs" src="/img/gear.png" /></div>
                                                    </td>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                    <div className="groupNotice"></div>
                                    <table className="table-bordered groupStats">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th colSpan="8">
                                                    <button className="backOfWeek" onClick={() => handleBackOfWeekClick(currentWeekStart, setCurrentWeekStart)}>◀</button>
                                                    <span className="date">{startOfWeek.getMonth() + 1}월 {startOfWeek.getDate()}일 ~ {endOfWeek.getMonth() + 1}월 {endOfWeek.getDate()}일</span>
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
                                                    const memberObject = JSON.parse(member);
                                                    const memberId = memberObject.id;
                                                    const name = memberObject.name;
                                                    console.log(`Rendering member: ${name}, ID: ${memberId}`); // 멤버 렌더링 확인
                                                    return (
                                                        <tr key={index}>
                                                            <td style={{ width: '200px' }}>{name}</td>
                                                            {datesOfWeek.map((date, dateIndex) => {
                                                                const currentDate = moment(date).format('YYYY-MM-DD');
                                                                const                                                                today = moment().format('YYYY-MM-DD');
                                                                if (currentDate === today) {
                                                                    return <td key={dateIndex} style={{ width: '100px' }}></td>;
                                                                }
                                                                let memberPoint;
                                                                if (membersOverall[currentDate] && membersOverall[currentDate][memberId] !== undefined) {
                                                                    memberPoint = membersOverall[currentDate][memberId];
                                                                } else {
                                                                    const prevDate = moment(date).subtract(1, 'days').format('YYYY-MM-DD');
                                                                    if (currentDate < today) {
                                                                        memberPoint = '-'; // 과거 날짜에는 "-" 표시
                                                                    } else {
                                                                        memberPoint = ''; // 미래 날짜에는 공백으로 표시
                                                                    }
                                                                }
                                                                return (
                                                                    <td key={dateIndex} style={{ width: '100px' }}>
                                                                        {memberPoint}
                                                                    </td>
                                                                );
                                                            })}
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
                } />
            </Routes>
            <PointModal showModal={showModal} setShowModal={setShowModal} members={members} penalty_per_point={penaltyPerPoint} />
            <SettingModal showSettingModal={showSettingModal} setShowSettingModal={setShowSettingModal} group_name={group_name} />
        </div>
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
    let prevPoint = Number.NEGATIVE_INFINITY;
    let rank = 1;
    let sameRankCount = 0;

    const tipMessage = "이번엔 꼴찌가 1등에게 벌금을 몰아주세요!";

    const parsedMembers = members.map((member) => JSON.parse(member));
    const rankedMembers = parsedMembers
        .map((member) => ({
            ...member,
            calculatedPoint: Math.abs(parseInt(member.missionTotalPoint)) * penalty_per_point,
        }))
        .sort((a, b) => {
            // totalpoint가 적을수록 등수가 높아지도록 오름차순 정렬
            if (a.missionTotalPoint === b.missionTotalPoint) {
                return a.name.localeCompare(b.name);
            }
            return a.missionTotalPoint - b.missionTotalPoint;
        });

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>이번 정산 결과는?</Modal.Title>
                <Modal.Dialog>1pt={penalty_per_point}원</Modal.Dialog>
            </Modal.Header>
            <Modal.Body>
                <p>{tipMessage}</p>
                {rankedMembers.map((member, index) => {
                    if (prevPoint !== member.missionTotalPoint) {
                        rank += sameRankCount;
                        sameRankCount = 1;
                    } else {
                        sameRankCount++;
                    }
                    prevPoint = member.missionTotalPoint;

                    return (
                        <p key={index}>
                            {rank}등: {member.name}: {member.missionTotalPoint}pt X {penalty_per_point} = -{member.calculatedPoint}원
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

// 설정 모달 컴포넌트
function SettingModal({ showSettingModal, setShowSettingModal, group_name, currentNotice, currentPenaltyPerPoint }) {
    const [newNotice, setNewNotice] = useState(currentNotice || "");
    const [newPenaltyPerPoint, setNewPenaltyPerPoint] = useState(currentPenaltyPerPoint || 0);
    
    const handleClose = () => {
        // 모달 닫기 전에 입력한 값 초기화하기
        setNewNotice(currentNotice);
        setNewPenaltyPerPoint(currentPenaltyPerPoint);
        setShowSettingModal(false);
    };

    const handleSaveChanges = async () => {
        if (!newNotice || !newPenaltyPerPoint) {
            alert("공지사항과 벌점 당 포인트를 모두 입력해주세요.");
            return;
        }
        try {
            await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/UpdateNotice.php', {
                groupName: group_name,
                newNotice: newNotice
            });
            console.log('공지사항 업뎃 성공');
    
            await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/UpdatePenalty.php', {
                groupName: group_name,
                Penalty: newPenaltyPerPoint
            });
            console.log('페널티 업뎃 성공');
    
            // 변경 완료 alert
            alert("그룹 정보 변경이 완료되었습니다.");

            // 페이지 새로고침하기 (정보 반영)
            window.location.reload();
        } catch (error) {
            console.error('변경사항 저장 실패:', error);
        }
    };
    return (
        <Modal show={showSettingModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>그룹 설정</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="formGroupNotice">
                    <Form.Label>공지사항</Form.Label>
                    <Form.Control type="text" placeholder="새로운 공지사항을 입력하세요" value={newNotice} onChange={(e) => setNewNotice(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formGroupPenalty">
                    <Form.Label>벌점 당 포인트</Form.Label>
                    <Form.Control type="number" placeholder="새로운 벌점 당 포인트를 입력하세요" value={newPenaltyPerPoint} onChange={(e) => setNewPenaltyPerPoint(e.target.value)} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button variant="primary" onClick={handleSaveChanges}>
                    변경사항 저장
                </Button>
            </Modal.Footer>
        </Modal>
    );
}


export default GroupPage;

