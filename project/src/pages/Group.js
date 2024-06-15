import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './Group.css';

axios.defaults.withCredentials = true;

function GroupPage(props) {
    let {userName, point, profileImage, fetchProfileImage} = props // Point를 받아옴
    let [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    let [showModal, setShowModal] = useState(false);
    let navigate = useNavigate();
    let startOfWeek = new Date(currentWeekStart);
    let endOfWeek = new Date(startOfWeek);
    let daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
    let datesOfWeek = [];
    let [change, setChange] = useState(false);
    const location = useLocation();
    const group_name = location.state.pageGroupName; // app.js에서 받아오게 되면 여기다가 넣기
    const [penaltyPerPoint, setPenaltyPerPoint] = useState(0); // 빈 배열 대신 0으로 초기화
    const [members, setMembers] = useState([]); // 여기서 members 상태 정의
    const [membersOverall, setMembersOverall] = useState({}); // 멤버별 개인 날짜별 포인트를 객체로 초기화
    const [memberMissionTables, setMemberMissionTables] = useState({}); // 클릭한 멤버의 미션 테이블 표시 상태를 관리하는 객체
    const [showSettingModal, setShowSettingModal] = useState(false); // 설정 모달 상태
    const [showPhotoModal, setShowPhotoModal] = useState(false); // 인증샷 모달
    const [modalPhotoSrc, setModalPhotoSrc] = useState(''); // 사진 경로
    const [modalMemberName, setModalMemberName] = useState(''); // 멤버 이름
    const [modalMissionName, setModalMissionName] = useState(''); // 미션 이름
    const [notice, setNotice] = useState(''); // 공지
    const [isNoticeExpanded, setIsNoticeExpanded] = useState(false); // 공지 드롭다운
    const [update, setUpdate] = useState(false); // 그룹 수정 모달 상태
    const [showExitModal, setShowExitModal] = useState(false);

    startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7)); // 주의 시작일을 월요일로 설정
    endOfWeek.setDate(endOfWeek.getDate() + 6); // 주의 마지막 날을 일요일로 설정

    const fetchPenaltyPerPoint = async () => {
        try {
            const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ShowPenalty.php', { groupName: group_name });
            const bringpenaltyPerPoint = res.data; // 벌점 당 포인트 가져 오기
            setPenaltyPerPoint(bringpenaltyPerPoint); // 상태에 벌점 당 포인트 설정
        } catch (error) {
            console.error('에러 fetching penalty per point:', error);
        }
    };
    useEffect(() => {
        fetchPenaltyPerPoint();
    }, [group_name]);

    const fetchNotice = async () => {
        try {
            const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ShowNotice.php', { groupName: group_name });
            const noticeData = res.data; // 공지 가져오기
            setNotice(noticeData); // 가져온 공지를 상태에 설정
        } catch (error) {
            console.error('에러 fetching notice:', error);
        }
    };
    useEffect(() => {
        fetchNotice();
    }, [group_name]);

    const fetchGroupMemberList = async () => {
        try {
            const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ShowGroupMemberInfo.php', { groupName: group_name });
            setMembers(res.data);
        } catch (error) {
            console.error('그룹멤버 실패', error);
        }
    };

    useEffect(() => {
        const fetchGroupMemberOverall = async () => {
            try {
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ShowGroupMemberPoint.php', { groupName: group_name });
                const pointsByDate = {};
                res.data.forEach(member => {
                    const memberId = member.id;
                    const memberPoints = member.point;

                    Object.keys(memberPoints).forEach(date => {
                        if (date !== "") {
                            const formattedDate = moment(date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
                            if (!pointsByDate[formattedDate]) {
                                pointsByDate[formattedDate] = {};
                            }
                            pointsByDate[formattedDate][memberId] = memberPoints[date];
                        } else {
                            const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
                            if (!pointsByDate[yesterday]) {
                                pointsByDate[yesterday] = {};
                            }
                            pointsByDate[yesterday][memberId] = memberPoints[""];
                        }
                    });
                });

                setMembersOverall(pointsByDate);
            } catch (error) {
                console.error('포인트 불러오기 실패', error);
            }
        };

        fetchGroupMemberList();
        fetchGroupMemberOverall();
    }, [group_name]);

    const toggleMissionTable = (memberId) => {
        setMemberMissionTables(prevState => ({
            ...prevState,
            [memberId]: !prevState[memberId]
        }));
    };

    const handleSettingModalOpen = () => {
        setShowSettingModal(true);
    };


    useEffect(() => {
        axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/CheckLoginState.php')
        .then(res => {
            if(res.data === false){
                navigate('/login');
            }
        })
        .catch(error => {
            console.error('Error fetching user login data:', error)
        })
    }, []);
    
    const handlePhotoOpen = (photoPath, memberName, missionName) => {
        let absolutePath = photoPath.replace('../project/public/', '');
        absolutePath = absolutePath.replace('..', '');
        console.log(absolutePath);
        setModalPhotoSrc(`/${absolutePath}`);
        setShowPhotoModal(true);
        setModalMemberName(memberName); // 멤버 이름 저장
        setModalMissionName(missionName); // 미션 이름 저장
    };

    const toggleNoticeExpansion = () => {
        setIsNoticeExpanded(prevState => !prevState);
    };

    // 탈퇴 후 적절한 동작을 위한 콜백 함수
    const handleExitCallback = () => {
        setShowExitModal(false); // 모달 닫기
        navigate('/');
    };

    const calculateColorByRank = (rank, totalRanks) => {
        const mainColor = '#FAF29D';
        const lightenFactor = 1 - (rank / totalRanks) * 0.9; // 순위가 높을수록 색상이 연해짐(overall이 클수록 색상이 진해짐)
        return `rgba(${parseInt(mainColor.slice(1, 3), 16)}, ${parseInt(mainColor.slice(3, 5), 16)}, ${parseInt(mainColor.slice(5, 7), 16)}, ${lightenFactor})`;
    };      

    for (let i = 0; i < 7; i++) {
        let date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        datesOfWeek.push(date);
    }

    return (
        <div className="Group">
            <Routes>
                <Route path="/" element={
                    <div>
                        <NavBar
                            userName={userName}
                            profileImage={profileImage}
                            Point={point}  
                            setChange={setChange}
                            navigate={navigate}
                        />
                        <div className="info-container">
                            <div className="calculate" onClick={() => setShowModal(true)}>포인트 정산하기</div>
                            <MemberList
                                members={members}
                                memberMissionTables={memberMissionTables}
                                toggleMissionTable={toggleMissionTable}
                                handlePhotoOpen={handlePhotoOpen}
                            />
                            <div className="groupExit">
                                <button className="button-exit" onClick={() => setShowExitModal(true)}>그룹 탈퇴하기</button>
                            </div>
                            <div className="handle"></div>
                        </div>
                        <GroupCalendar
                            group_name={group_name}
                            penaltyPerPoint={penaltyPerPoint}
                            notice={notice}
                            isNoticeExpanded={isNoticeExpanded}
                            toggleNoticeExpansion={toggleNoticeExpansion}
                            startOfWeek={startOfWeek}
                            endOfWeek={endOfWeek}
                            daysOfWeek={daysOfWeek}
                            datesOfWeek={datesOfWeek}
                            members={members}
                            membersOverall={membersOverall}
                            handleBackOfWeekClick={handleBackOfWeekClick}
                            handleFrontOfWeekClick={handleFrontOfWeekClick}
                            setCurrentWeekStart={setCurrentWeekStart}
                            calculateColorByRank={calculateColorByRank}
                            setUpdate={setUpdate}
                        />
                    </div>
                } />
            </Routes>
            <PointModal
                showModal={showModal}
                setShowModal={setShowModal}
                members={members}
                penalty_per_point={penaltyPerPoint}
                group_name={group_name}
                fetchGroupMemberList={fetchGroupMemberList}
            />
            <SettingModal
                showSettingModal={showSettingModal}
                setShowSettingModal={setShowSettingModal}
                group_name={group_name}
            />
            <PhotoModal
                showPhotoModal={showPhotoModal}
                setShowPhotoModal={setShowPhotoModal}
                modalPhotoSrc={modalPhotoSrc}
                memberName={modalMemberName}
                missionName={modalMissionName}
            />
            <UpdateGroup
                update={update}
                setUpdate={setUpdate}
                group_name={group_name}
                penaltyPerPoint={penaltyPerPoint}
                notice={notice}
                fetchPenaltyPerPoint={fetchPenaltyPerPoint}
                fetchNotice={fetchNotice}
            />
            <ChangeProfileImage
                change={change}
                setChange={setChange}
                profileImage={profileImage}
                fetchProfileImage = {fetchProfileImage}
                fetchGroupMemberList={fetchGroupMemberList}
            />
            <GroupExitModal
                showExitModal={showExitModal}
                setShowExitModal={setShowExitModal}
                group_name={group_name}
                exitCallback={handleExitCallback}
                navigate={navigate}
            />
        </div>
    );
}

function NavBar({ userName, profileImage, Point, setChange, navigate }) {
    return (
        <div className="nav-bar">
            <img className="img-logo" onClick={() => { navigate('/') }} src="/img/dream.png" />
            <div className="nav-profile">
                <img className="img-profile" onClick={() => { setChange(true) }} src={profileImage} alt="Profile"></img>
                <h6>{userName}</h6>
                <h6>today {Point}</h6>
                <img className="imgs" onClick={() => { navigate('/updateinfo') }} src="/img/gear.png" />
                <button className="button-logout" onClick={() => {
                    axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/LogOut.php')
                        .then(res => {
                            navigate('/login');
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }}>로그아웃</button>
            </div>
        </div>
    );
}

function GroupInfo({ group_name, penaltyPerPoint, setUpdate }) {
    const penaltyString = penaltyPerPoint?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
<div className="groupInfo">
    <table className="groupTable">
        <tbody>
            <tr className="desktopRow">
                <th className="groupName">{group_name}</th>
                <th className="penaltyPerPoint"><div>1 pt = {penaltyString} 원</div></th>
                <th className="groupOption"><img className="imgs" src="/img/gear.png" onClick={() => { setUpdate(true) }} /></th>
            </tr>
            <tr className="mobileRow">
                <th className="groupName">{group_name}</th>
                <th className="groupOption"><img className="imgs" src="/img/gear.png" onClick={() => { setUpdate(true) }} /></th>
            </tr>
            <tr className="mobileRow">
                <th className="penaltyPerPoint"><div>1 pt = {penaltyString} 원</div></th>
            </tr>
        </tbody>
    </table>
</div>

    );
}

function MemberList({ members, memberMissionTables, toggleMissionTable, handlePhotoOpen }) {
    return (
        <div className="members">
            <div className="infoMember">멤버</div>
            <div className="infoMembers">
                {Array.isArray(members) ? (
                    members.map((member, index) => {
                        const memberObject = JSON.parse(member);
                        const id = memberObject.id;
                        const name = memberObject.name;
                        const profileImage = memberObject.profileImage;
                        const missionList = memberObject.missionList;
                        const missionTotalCount = memberObject.missionTotalCount;
                        const missionNotCompleteCount = memberObject.missionNotCompleteCount;
                        const missionTotalPoint = memberObject.missionTotalPoint;
                        return (
                            <div key={index} className="member">
                                <span>
                                    <table className="memberInfo" onClick={() => toggleMissionTable(id)}>
                                        <tbody>
                                            <tr>
                                                <td style={{ width: '20%' }}><img className="img-profile" src={profileImage === '/img/default_profile.png' ? profileImage : profileImage.replace(/^..\/project\/public/, "")} alt="Profile" /></td>
                                                <td className="MemberName" style={{ width: '40%' }}>{name}</td>
                                                <td style={{ width: '20%' }}>{missionTotalCount - missionNotCompleteCount}/{missionTotalCount}</td>
                                                <td style={{ width: '20%' }}>{missionTotalPoint === 0 ? '0' : (missionTotalPoint > 0 ? `-${missionTotalPoint}` : missionTotalPoint)}pt</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </span>
                                {memberMissionTables[id] && (
                                    <table className="missionTable">
                                        <tbody>
                                            {missionList.map((mission, missionIndex) => {
                                                const missionObject = JSON.parse(mission);
                                                const missionComplete = missionObject.complete;
                                                const missionName = missionObject.mission;
                                                const missionPhoto = missionObject.photo;
                                                const isLastMission = missionIndex === missionList.length - 1;
                                                return (
                                                    <tr key={missionIndex} className={isLastMission ? "missionNameLast" : "missionName"}>
                                                        <td valign='middle'>
                                                            <div className="checkbox">
                                                                <input type="checkbox" checked={missionComplete === 1 ? true : false} disabled />
                                                            </div>
                                                        </td>
                                                        <td>{missionName}</td>
                                                        <td>
                                                            {missionPhoto ? (
                                                                <button className="button-camera" onClick={() => handlePhotoOpen(missionPhoto, name, missionName)}>
                                                                    <img className="imgs" src="/img/camera.png" />
                                                                </button>
                                                            ) : (
                                                                <button className="button-camera" disabled>
                                                                    <img className="imgs" src="/img/camera_gray.png" />
                                                                </button>
                                                            )}
                                                        </td>
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
    );
}

function GroupCalendar({ group_name, penaltyPerPoint, notice, isNoticeExpanded, toggleNoticeExpansion, startOfWeek, endOfWeek, daysOfWeek, datesOfWeek, members, membersOverall, handleBackOfWeekClick, handleFrontOfWeekClick, setCurrentWeekStart, calculateColorByRank, setUpdate }) {
    return (
        <div className="groupCalendar-container">
            <div className="groupCalendar">
                <GroupInfo group_name={group_name} penaltyPerPoint={penaltyPerPoint} setUpdate={setUpdate} />
                <div className="groupNotice" onClick={toggleNoticeExpansion}>
                    <div className='noticeMent-box'>
                        <img className="img-notice" src="/img/notice.png"></img>
                        <span className='noticeMent'>공지</span>
                    </div>
                    <span className="Notice" dangerouslySetInnerHTML={{ __html: isNoticeExpanded ? notice.replace(/\n/g, "<br>") : notice.slice(0, 100) }}></span>
                    {notice.length > 20 && !isNoticeExpanded && <span>...</span>}
                </div>
                <table className="table-bordered groupStats">
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th colSpan="8">
                                <button className="backOfWeek" onClick={() => handleBackOfWeekClick(startOfWeek, setCurrentWeekStart)}>◀</button>
                                <span className="date">{startOfWeek.getMonth() + 1}월 {startOfWeek.getDate()}일 ~ {endOfWeek.getMonth() + 1}월 {endOfWeek.getDate()}일</span>
                                <button className="frontOfWeek" onClick={() => handleFrontOfWeekClick(startOfWeek, setCurrentWeekStart)}>▶</button>
                            </th>
                        </tr>
                        <tr>
                            <th>&nbsp;</th>
                            {daysOfWeek.map((day, index) => (
                                <th key={index}>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>&nbsp;</td>
                            {datesOfWeek.map((date, index) => (
                                <td key={index} className="dateRow">{date.getDate()}</td>
                            ))}
                        </tr>
                        {Array.isArray(members) ? (
                            members.map((member, index) => {
                                const memberObject = JSON.parse(member);
                                const memberId = memberObject.id;
                                const name = memberObject.name;
                                return (
                                    <tr key={index}>
                                        <td className="nameRow" style={{ width: '200px' }}>{name}</td>
                                        {datesOfWeek.map((date, dateIndex) => {
                                            const currentDate = moment(date).format('YYYY-MM-DD');
                                            const today = moment().format('YYYY-MM-DD');
                                            let memberPoint = '';
                                            if (currentDate === today) {
                                                return <td key={dateIndex} style={{ width: '100px' }}></td>;
                                            }
                                            if (membersOverall[currentDate] && membersOverall[currentDate][memberId] !== undefined) {
                                                memberPoint = membersOverall[currentDate][memberId];
                                            } else if (currentDate < today) {
                                                memberPoint = '-';  // 과거 날짜는 '-'
                                            }
                                            const dailyPoints = Object.values(membersOverall[currentDate] || {});
                                            const sortedPoints = [...dailyPoints].sort((a, b) => b - a);
                                            const rank = sortedPoints.indexOf(memberPoint) + 1;
                                            const totalRanks = sortedPoints.length;
                                            const cellColor = memberPoint !== '-' && memberPoint !== '' ? calculateColorByRank(rank, totalRanks) : 'transparent';
                                            return (
                                                <td key={dateIndex} style={{ width: '100px', backgroundColor: cellColor }}>
                                                    {memberPoint !== '' && memberPoint !== '-' && memberPoint !== 0 ? `-${memberPoint}` : memberPoint}
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

function PointModal({ showModal, setShowModal, members, penalty_per_point, group_name, fetchGroupMemberList }) {
    let prevPoint = Number.NEGATIVE_INFINITY;
    let rank = 1;
    let sameRankCount = 0;

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [calculationResult, setCalculationResult] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [tipMessage, setTipMessage] = useState('');
    const [prevN, setPrevN] = useState(null);
    const [prevM, setPrevM] = useState(null);
    const [isChecked, setIsChecked] = useState(true);

    const parsedMembers = members.map((member) => JSON.parse(member));
    const rankedMembers = parsedMembers
        .map(member => ({
            ...member,
            calculatedPoint: Math.abs(parseInt(member.missionTotalPoint)) * penalty_per_point,
        }))
        .sort((a, b) => {
            if (a.missionTotalPoint === b.missionTotalPoint) {
                return a.name.localeCompare(b.name);
            }
            return a.missionTotalPoint - b.missionTotalPoint;
        });

    const getRankStyle = (rank, index, totalMembers) => {
        if (rank === 1) return { backgroundColor: '#FAF29F', textAlign: 'center' };
        if (rank === 2) return { backgroundColor: '#DBDBDB', textAlign: 'center' };
        if (rank === 3) return { backgroundColor: '#FADB9F', textAlign: 'center' };
        if (index === totalMembers - 1) return { backgroundColor: '#FFD0D0', textAlign: 'center' };
        return { backgroundColor: '#EAFFF4', textAlign: 'center' };
    };

    const handlePointCalculation = async (group_name, penalty_per_point) => {
        setLoading(true);
        setShowConfirmModal(false);

        try {
            await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/Do_cost_settlement.php', { group_name: group_name });
            if(isChecked === true) {
                createExcelFile(rankedMembers, group_name, penalty_per_point);
            }
            setCalculationResult('success');
            fetchGroupMemberList(); // 정산 성공 후 멤버 리스트 갱신
        } catch (err) {
            setCalculationResult('failure');
        } finally {
            setLoading(false);
            setShowResultModal(true);
        }
    };

    const generateTipMessage = () => {
        const tips = [
            "{m}등의 벌금을 {n}등에게 몰아주세요!",
            "{n}등과 {m}등의 벌금을 바꿔보세요!",
            "{n}등은 벌금 면제!",
            "벌금 전체를 모아 회식 갑시다!",
        ];
        
        const getValidRanks = () => {
            const ranks = [];
            let currentRank = 1;
            let currentPoint = rankedMembers[0]?.missionTotalPoint;
            rankedMembers.forEach(member => {
                if (currentPoint !== member.missionTotalPoint) {
                    currentRank += ranks.filter(rank => rank === currentRank).length;
                }
                ranks.push(currentRank);
                currentPoint = member.missionTotalPoint;
            });
            
            // 모든 멤버의 등수가 동일한 경우
            if (ranks.every(rank => rank === ranks[0])) {
                return [];
            }

            return ranks;
        };

        const validRanks = getValidRanks();
        if (validRanks.length === 0) {
            return "제작자에게 메로나 사주세요!";
        }
        const getRandomRank = () => validRanks[Math.floor(Math.random() * validRanks.length)];
        
        let n = getRandomRank();
        let m = getRandomRank();

        // n이랑 m같으면 다시
        while (n === m) {
            n = getRandomRank();
            m = getRandomRank();
        }

        setPrevN(n);
        setPrevM(m);

        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        return randomTip.replace('{n}', n).replace('{m}', m);
    };

    const createExcelFile = (rankedMembers, group_name, penalty_per_point) => {
        const penaltyString = penalty_per_point?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'원';
        const worksheetData = rankedMembers.map((member, index) => ({
            '등수': index + 1,
            '이름': member.name,
            '포인트': member.missionTotalPoint*(-1),
            '페널티 금액': penaltyString,
            '총 벌금': (member.calculatedPoint*(-1))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'원'
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '정산 결과');

        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    

        console.log(group_name)
        const fileName = `정산결과_${group_name}_${formattedDate}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    }

    useEffect(() => {
        if (showModal) {
            setTipMessage(generateTipMessage());
        }
        if (!showModal) {
            setIsChecked(true);
        }
    }, [showModal]);

    useEffect(() => {
        if (!showConfirmModal) {
            setIsChecked(true);
        }
    }, [showConfirmModal])

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                setShowResultModal(false);
            }
        };
    
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [setShowResultModal]);
    

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };
    

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)} className='calculateModal modal-xl'>
                <Modal.Header closeButton>
                    <div className='modalTitle-div'>
                        <div className='modalTitle-side'></div>
                        <div className='modalTitle'>이번 정산 결과는?</div>
                        <div className='modalTitle-side'>
                            <div className='penaltyPerPointDiv'>1 pt = {penalty_per_point?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원</div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col text-center'>
                            <div className='tipMessage'>tip: {tipMessage}</div>
                        </div>
                    </div>
                    <div className='table-responsive'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>등수</th>
                                    <th>이름</th>
                                    <th>포인트</th>
                                    <th></th>
                                    <th>페널티 금액</th>
                                    <th></th>
                                    <th>총 벌금</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankedMembers.map((member, index) => {
                                    if (prevPoint !== member.missionTotalPoint) {
                                        rank += sameRankCount;
                                        sameRankCount = 1;
                                    } else {
                                        sameRankCount++;
                                    }
                                    prevPoint = member.missionTotalPoint;
                                    const penaltyString = penalty_per_point?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    const rankStyle = getRankStyle(rank, index, rankedMembers.length);
                                    return (
                                        <tr key={index}>
                                            <td style={{ width: '50px', verticalAlign: 'middle' }}><div className='tableRank' style={{ ...rankStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{rank}</div></td>
                                            <td className="ModalName" style={{ verticalAlign: 'middle' }}>{member.name}</td>
                                            <td style={{ verticalAlign: 'middle' }}>
                                                {member.missionTotalPoint !== 0 ? `- ${member.missionTotalPoint} Point` : `${member.missionTotalPoint} Point`}
                                            </td>
                                            <td style={{ verticalAlign: 'middle' }}>X</td>
                                            <td style={{ verticalAlign: 'middle' }}>{penaltyString}원</td>
                                            <td style={{ verticalAlign: 'middle' }}>=</td>
                                            <td style={{ verticalAlign: 'middle' }}>{(member.calculatedPoint*(-1))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="modalClose" variant="secondary" onClick={() => setShowModal(false)}>
                        닫기
                    </Button>
                    <Button className="doCalculate" variant="primary" onClick={() => setShowConfirmModal(true)}>정산 실행</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} className='calculateModal'>
                <Modal.Header closeButton>
                    <Modal.Title className="modalTitle">정산 확인</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center modalBody'>
                    <p>정말 정산을 실행하시겠습니까? 되돌릴 수 없어요!</p>
                    <label>
                        <input type="checkbox" className='xlsx-checkbox' checked={isChecked} onChange={handleCheckboxChange}></input>
                        정산 파일 다운 받기 (xlsx)
                    </label>
                    <img className="dreams" src="/img/dream_loading_1.gif" alt="loading" />
                    <p>드림이는 열심히 정산중이에요...</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="modalClose" variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        아니요
                    </Button>
                    <Button className="doCalculate" variant="primary" onClick={() => handlePointCalculation(group_name, penalty_per_point)}>
                        예
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showResultModal} onHide={() => setShowResultModal(false)} className='calculateModal'>
                <Modal.Header closeButton>
                    <Modal.Title className="modalTitle">정산 결과</Modal.Title>
                </Modal.Header>
                <Modal.Body  className='text-center modalBody'>
                    {calculationResult === 'success' ? (
                        <>
                            <p>드림이가 정산에 성공했어요!</p>
                            <img className="dreams" src="/img/dream_O.gif" alt="success"/>
                        </>
                    ) : (
                        <>
                            <p>드림이가 정산에 실패했어요...</p>
                            <img className="dreams" src="/img/dream_X.gif" alt="failure"/>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="modalClose" variant="secondary" onClick={() => {
                        setShowResultModal(false)
                        setShowModal(false)
                    }}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
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

            alert("그룹 정보 변경이 완료되었습니다.");

            // 페이지 새로고침하기
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

function getModalTitle(memberName, missionName) {
    return (
        <>
            {memberName}
            <br />
            : {missionName}
        </>
    );
}

function PhotoModal({ showPhotoModal, setShowPhotoModal, modalPhotoSrc, memberName, missionName }) {
    const handlePhotoClose = () => {
        setShowPhotoModal(false);
    };

    const modalTitle = getModalTitle(memberName, missionName); // 멤버 이름과 미션 이름 갖고 타이틀 생성

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                setShowPhotoModal(false);
            }
        };
    
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [setShowPhotoModal]);
    
    return (
        <Modal show={showPhotoModal} onHide={handlePhotoClose} className="photoModal modal-large">
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={modalPhotoSrc} alt={`${memberName}의 ${missionName}`} style={{ width: '100%' }} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className="modalClose" onClick={handlePhotoClose}>
                    닫기
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function ChangeProfileImage(props) {
    const [selectedFile, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [fileName, setFileName] = useState('');
  
    useEffect(() => {
      if (!props.change) {
        setIsEditing(false);
        setFileName('');
      }
    }, [props.change]);
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setFile(file);
    };
  
    const handleUpload = async () => {
      if (!selectedFile) {
        alert('파일을 선택해주세요.');
        return;
      }
  
      const formData = new FormData();
      formData.append('imgFile', selectedFile);
  
      try {
        const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ProfileImageUpload.php', formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        if (res.data == true) {
          alert("프로필 사진이 변경되었습니다!");
          props.fetchProfileImage();
          props.setChange(false);
          props.fetchGroupMemberList();
        }
        else {
          console.log(res.data.error);
        }
      } catch (error) {
        console.log(`업로드 실패: ${error.message}`);
      }
    };
  
    const handleRemove = async () => {
      const confirmRemove = window.confirm('정말로 프로필 사진을 제거하시겠습니까?');
  
      if (!confirmRemove) {
        return;
      }
  
      try {
        const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/DeleteProfileImage.php');
        if (res.data) {
          alert("프로필 사진이 제거되었습니다!");
          props.fetchProfileImage();
          props.setChange(false);
        } else {
          console.log(res.data.error);
        }
      } catch (error) {
        console.log(`제거 실패: ${error.message}`);
      }
    };
  
    const handleFileUpload = (event) => {
      const newFileName = event.target.value.split('\\').pop();
      setFileName(newFileName);
    };
  
    return (
      <Modal show={props.change} onHide={() => props.setChange(false) } className="main-modal">
        <Modal.Header closeButton>
          <Modal.Title className='main-modal-title'>프로필 사진</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal-change'>
          {isEditing ? (
            <>
              <img className="img-left" src="/img/left.png" onClick={()=>{setIsEditing(false);}}></img>
              <div className='modal-change-editing'>
                <div>
                <input type="file" onChange={(event) => {
                    handleFileChange(event);
                    handleFileUpload(event);
                }} id="input-file" />
                <label htmlFor="input-file">업로드</label>
                <input type="text" value={fileName} placeholder='선택된 파일이 없습니다.' readOnly></input>
                </div>
                <button className='button-profile' onClick={handleUpload}>변경하기</button>
              </div>
            </>
          ) : (
            <>
              <img className="img-profile-change" src={props.profileImage}></img>
              <div className='modal-change-buttons'>
                <button className='button-profile profile-remove' onClick={handleRemove}>제거</button>
                <button className='button-profile' onClick={()=> {setIsEditing(true);}}>변경</button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    );
  }

function UpdateGroup(props) {
    const [isSelectPrice, setIsSelectPrice] = useState(Array(6).fill(false));
    const [groupName, setGroupName] = useState(props.group_name);
    const [groupNotice, setGroupNotice] = useState(props.notice);
    const [groupPassword, setGroupPassword] = useState('');
    const [isPasswordTrue, setIsPasswordTrue] = useState(true);
    const priceArr = ['₩ 0', '₩ 500', '₩ 1,000', '₩ 2,000', '₩ 3,000', '₩ 5,000'];

    useEffect(() => {
        const newArr = Array(priceArr.length).fill(false);
        const numericalPriceArr = priceArr.map(price => price.replace(/[^\d]/g, ''), 10);
        const index = numericalPriceArr.indexOf(props.penaltyPerPoint);
        
        if (index !== -1) {
            newArr[index] = true;
        }
        setIsSelectPrice(newArr);
    }, [props.penaltyPerPoint]);

    useEffect(() => {
        setGroupNotice(props.notice)
    }, [props.notice])    

    useEffect(() => {
        if (!props.update) {
        setGroupName(props.group_name);
        setGroupNotice(props.notice);
        setGroupPassword('');
        const newArr = Array(priceArr.length).fill(false);
        const numericalPriceArr = priceArr.map(price => price.replace(/[^\d]/g, ''), 10);
        const index = numericalPriceArr.indexOf(props.penaltyPerPoint);
        if (index !== -1) {
            newArr[index] = true;
        }
        setIsSelectPrice(newArr);
        setIsPasswordTrue(true);
        }
    }, [props.update]);

    const handleClickPrice = (idx) => {
        const newArr = Array(priceArr.length).fill(false);
        newArr[idx] = true;
        setIsSelectPrice(newArr);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const selectedPriceString = priceArr[isSelectPrice.indexOf(true)];
        const selectedPrice = parseInt(selectedPriceString.replace(/[^\d]/g, ''), 10);
        
        try {
        const response = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/UpdateGroup.php', {
            groupName: groupName,
            Penalty: selectedPrice,
            newNotice: groupNotice,
            groupPassword: groupPassword
        });
        if (response.data == true) {
            alert('[ '+groupName+' ] 그룹 설정이 변경되었습니다!')
            props.setUpdate(false);
            props.fetchPenaltyPerPoint();
            props.fetchNotice();
        }
        else if (response.data.error == '그룹 비밀번호가 일치하지 않습니다.'){
            setIsPasswordTrue(false);
        }
        } catch (error) {
        console.log(error);
        }
    };

    return (
        <Modal show={props.update} onHide={() => props.setUpdate(false)} className='main-modal modal-xl'>
        <Modal.Header closeButton>
            <Modal.Title className='main-modal-title'>그룹 설정 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-creategroup">
            <form onSubmit={handleSubmit}>
            <div className='modal-div'>
                <h5>그룹 이름</h5>
                <input
                className="input-groupname"
                type="text"
                value={props.group_name}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="그룹 이름을 작성해주세요!"
                disabled
                />
            </div>
            <div className='modal-div'>
                <h5>포인트 별 금액</h5>
                <div>
                {priceArr.map((content, i) => (
                    <button
                    key={i}
                    type="button"
                    className={`button-price ${isSelectPrice[i] ? 'button-price-clicked' : ''}`}
                    onClick={() => handleClickPrice(i)}
                    >
                    {content}
                    </button>
                ))}
                <div className='modal-p'>
                    <p>동기부여를 위해 포인트별 금액을 설정해보세요! 벌금처럼 걷어서 회식이나 1/n을 해도 좋고, 꼴등이 1등에게 쏘기도 좋아요!</p>
                    <p>벌금이 부담스럽다면 0원으로 설정 후 상벌을 정해보세요.</p>
                </div>
                </div>
            </div>
            <div className='modal-div'>
                <h5>그룹 공지사항</h5>
                <textarea
                value={groupNotice}
                onChange={(e) => setGroupNotice(e.target.value)}
                placeholder="그룹 내에서 지켜야 할 규칙을 작성해주세요."
                ></textarea>
            </div>
            <div className='modal-div'>
                <h5>가입 비밀번호</h5>
                <input
                className="input-grouppw"
                type="password"
                value={groupPassword}
                onChange={(e) => {setGroupPassword(e.target.value); setIsPasswordTrue(true);}}
                placeholder="기존 비밀번호를 작성해주세요!"
                />
                {!isPasswordTrue && <p className='error-message'>비밀번호를 확인해주세요!</p>}
            </div>
            <Modal.Footer>
                <Button
                type='submit'
                className={`button-group ${!groupName || !groupNotice || !groupPassword || isSelectPrice.indexOf(true) === -1 || !isPasswordTrue? 'button-disabled' : ''}`}
                variant="secondary"
                disabled={!groupName || !groupNotice || !groupPassword || isSelectPrice.indexOf(true) === -1 || !isPasswordTrue}
                >
                그룹 수정하기
                </Button>
            </Modal.Footer>
            </form>
        </Modal.Body>
        </Modal>
    );
}

// 그룹탈퇴 모달
function GroupExitModal({ showExitModal, setShowExitModal, group_name, exitCallback }) {
    const [calculationResult, setCalculationResult] = useState(null); // 탈퇴 결과 상태

    const handleGroupExit = async () => {
        try {
            await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ExitGroup.php', { groupName: group_name });
            // 탈퇴 성공 시
            setCalculationResult('success'); // 탈퇴 성공 상태 설정
        } catch (err) {
            // 탈퇴 실패 시
            console.error('그룹 탈퇴 실패', err);
            setCalculationResult('failure'); // 탈퇴 실패 상태 설정
        }
    };

    const handleCloseModal = () => {
        setShowExitModal(false);
        exitCallback();
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter' && calculationResult) {
                setCalculationResult(null); // 성공/실패 모달 닫기
                handleCloseModal(); // 모달 닫기 및 콜백 함수 호출
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [calculationResult]);

    return (
        <Modal show={showExitModal} onHide={() => setShowExitModal(false)} className='calculateModal'>
            <Modal.Header closeButton>
                <Modal.Title className="modalTitle">그룹 탈퇴</Modal.Title>
            </Modal.Header>
            <Modal.Body className='text-center modalBody'>
                <p>정말 탈퇴하시겠어요?</p>
                <img className="dreams" src="/img/dream_X.gif" alt="failure"/>
                <p>(드림이는 속상해)</p>
            </Modal.Body>
            <Modal.Footer>
                <Button  className="modalClose" variant="secondary" onClick={() => setShowExitModal(false)}>
                    취소
                </Button>
                <Button className="doCalculate" variant="primary" onClick={handleGroupExit}>
                    탈퇴하기
                </Button>
            </Modal.Footer>
            {/* 탈퇴 성공 시 모달 */}
            {calculationResult === 'success' && (
                <Modal show={true} className='calculateModal'>
                    <Modal.Header closeButton>
                        <Modal.Title className="modalTitle">탈퇴 성공</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='text-center modalBody'>
                        <p>그룹에서 성공적으로 탈퇴되었습니다!</p>
                        <img className="dreams" src="/img/dream_O.gif" alt="success"/>
                        <p>다음에 또 만나요!</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button  className="modalClose" variant="secondary" onClick={handleCloseModal}>
                            확인
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
            {/* 탈퇴 실패 시 모달 */}
            {calculationResult === 'failure' && (
                <Modal show={true} className='calculateModal'>
                    <Modal.Header closeButton>
                        <Modal.Title className="modalTitle">탈퇴 실패</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='text-center modalBody'>
                        <p>그룹 탈퇴에 실패했습니다...</p>
                        <img className="dreams" src="/img/dream_X.gif" alt="failure"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button  className="modalClose" variant="secondary" onClick={handleCloseModal}>
                            확인
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Modal>
    );
}


export default GroupPage;
