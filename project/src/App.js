import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Nav } from 'react-bootstrap';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './App.css';
import Group from './pages/Group.js';
import LogIn from './pages/LogIn.js';
import SignUp from './pages/SignUp.js';
import UpdateInfo from './pages/UpdateInfo.js';
axios.defaults.withCredentials = true;

function App() {
  let [missionList, setMissionList] = useState([]);
  let [groupList, setGroupList] = useState([]);
  let [join, setJoin] = useState(false);
  let [create, setCreate] = useState(false);
  let [change, setChange] = useState(false);

  let [userName, setUserName] = useState();
  let [point, setPoint] = useState();
  let [missionInput, setMissionInput] = useState('');
  let [profileImage, setProfileImage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  let [tap, setTap] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/CheckLoginState.php')
    .then(res => {
      if(res.data === false){
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    })
    .catch(error => {
      console.error('Error fetching user login data:', error)
    })
  }, [navigate]);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/GetInfo.php');
        const userData = res.data;
        setUserName(userData.name);
        const missionCnt = userData.totalMissionCnt - userData.noMissionCnt
        const string = missionCnt  + ' / ' + userData.totalMissionCnt;
        setPoint(string);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();

    const fetchProfileImage = async () => {
      try {
        const res = await axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/ProfileImageShow.php');
        let originalPath = res.data.profilePath;
        if (originalPath != null) {
          if (originalPath === '/img/default_profile.png') {
            setProfileImage(originalPath);
          } else {
            let trimmedPath = originalPath.replace(/^..\/project\/public/, "");
            setProfileImage(trimmedPath);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfileImage();
  });
  

  if (isLoggedIn === null) {
    return (
      <div className='page-loading'>
        <img className="img-loading" src="/img/dream_loading_2.gif"></img>
        <div className='text-loading'>로딩중...</div>
      </div>
    );
  }

  const handleAddMission = async () => {
    try {
      if (missionInput.trim() === '') {
        setMissionInput('');
        return; // 미션 입력란이 비어 있으면 함수 종료
      }
      // 새로운 미션 추가
      const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/Insert_mission.php', {
        mission: missionInput // 미션 내용
      });
    
      // 미션 목록 갱신
      // 미션 목록이 비어 있는지 확인하고 새로운 미션을 추가
      if (!missionList || missionList.length === 0) {
        setMissionList([missionInput]);
      } else {
        // 미션 목록이 비어 있지 않으면 기존 미션 목록과 새로운 미션을 합쳐서 새로운 미션 목록을 만듦
        setMissionList([...missionList, missionInput]);
      }
      fetchMissions(setMissionList);
      
      setMissionInput('');
    } catch (error) {
      console.error('Error adding mission:', error);
    }
  };
  
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={ <LogIn navigate={navigate}/> }/>
        {isLoggedIn ? (
          <Route path="/" element={
            <div>
              <div className="nav-bar">
                <img className="img-logo" onClick={()=>{navigate('/')}} src="/img/dream.png"/>
                <div className="nav-profile">
                  <img className="img-profile" onClick={()=>{ setChange(true) }} src={profileImage} alt="Profile"></img>
                  <h6>{ userName }</h6>
                  <h6>today { point }</h6>
                  <img className="imgs" onClick={() => { navigate('/updateinfo') }} src="/img/gear.png"/>
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
              <div className="main-top">
                {
                  tap == 0? <>
                    <h1>To do list</h1>
                    <input className="input-todo" type="text" value={missionInput} onChange={(e)=>{ setMissionInput(e.target.value)}}placeholder="오늘의 할 일을 작성하세요!"></input>
                    <button className="button-todo-plus" onClick={handleAddMission}>+</button>
                  </> :
                  <>
                  <h1>Calendar</h1>
                  <h5 className="top-calendar-text">할 건 다하고 노는거니?</h5>
                  </>
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
                tap == 0 ? <ToDo setCreate={setCreate} setJoin={setJoin} groupList={groupList} missionList={missionList} setMissionList={setMissionList} setGroupList={setGroupList} navigate={navigate}/> : null
              }
              {
                tap == 1 ? <MyCalendar/> : null
              }
            </div>
          }/>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        <Route path="/signup" element={ <SignUp/> }/>
        <Route path="/group/*" element={ <Group/> }/>
        <Route path="/updateinfo" element={ <UpdateInfo/> }/>
        <Route path="*" element={<div>404</div>}/>
      </Routes>
      <CreateGroup create={create} setCreate={setCreate} setGroupList={setGroupList}/>
      <JoinGroup join={join} setJoin={setJoin} setGroupList={setGroupList}/>
      <ChangeProfileImage change={change} setChange={setChange} profileImage={profileImage}/>
    </div>
  );
}


const fetchMissions = async (setMissionList) => {
  try {
    const res = await axios.get(`http://localhost/MISSION_DREAM_TEAM/PHP/Show_mission.php?`)
    if (res.data == null) {
      setMissionList([]);
    } else {
      const missions = res.data.map(mission => ({
        ...mission,
        isCompleted: mission[4] === 1
      }));
      setMissionList(missions);
    }
  } catch (error) {
      console.error('Error fetching missions:', error)
  }
}

const fetchGroups = async (setGroupList) => {
  try {
      const res = await axios.get(`http://localhost/MISSION_DREAM_TEAM/PHP/ShowGroup.php?`)
      setGroupList(res.data)
  } catch (error) {
      console.error('Error fetching missions:', error)
  }
}

// Todo 탭
function ToDo(props) {
  const inputFileRef = useRef([]);
  let [photo, setPhoto] = useState(false);
  let [photoSrc, setPhotoSrc] = useState('');
  let [photoMissionName, setPhotoMissionName] = useState('');
  
  useEffect(() => {
    fetchMissions(props.setMissionList);
    fetchGroups(props.setGroupList);
  }, []);
  
  const handleDeleteMission = async (i) => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    if (currentHour >= 5 && currentHour < 21) {
      try {
        const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/Delete_mission.php', {
          mission_idx: props.missionList[i][0]
        })
        fetchMissions(props.setMissionList);
      } catch (error) {
        console.error('Error deleting mission:', error);
      }
    } else {
      alert("미션은 05:00~21:00에만 삭제 가능합니다!");
    }
  };
  
  const handleImageUpload = async (e, missionId, index) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('imgFile', file);
    formData.append('mission_idx', missionId)

    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    try {
      const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/MissionImageUpload.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data) {
        props.setMissionList(prevMissions => {
          const newMissions = [...prevMissions];
          newMissions[index].isCompleted = true;
          newMissions[index][3] = res.data;
          return newMissions;
        });
      }
      inputFileRef.current[index].value = "";
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handlePhotoOpen = async (photoPath, missionName) => {
    console.log(photoPath, missionName)
    let absolutePath = photoPath.replace('../project/public/', '');
    absolutePath = absolutePath.replace('..', '');
    setPhotoSrc(`/${absolutePath}`);
    setPhoto(true);
    setPhotoMissionName(missionName);
  };

  return(
    <div className="todo-tap">
      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          {props.missionList && props.missionList.length > 0 && (
            props.missionList.map(function(content, i){
              return (
                <div className="mission" key={i}>
                  <input type="checkbox" className="mission-checkbox" checked={content.isCompleted || false} readOnly/>
                  <h6 id={ content[2] } style={{ textDecoration: content.isCompleted ? 'line-through' : 'none' }}>{ content[2] }</h6>
                  <input type="file" accept="image/*" ref={(el) => (inputFileRef.current[i] = el)} style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, content[0], i)} />
                  <img className="imgs" src={content.isCompleted ? "/img/camera_gray.png" : "/img/camera.png"}
                    onClick={() => {
                    if (content.isCompleted) {
                      handlePhotoOpen(content[3],content[2])
                    } else {
                      inputFileRef.current[i].click();
                    }}}
                    onContextMenu={() => {
                      if (content.isCompleted) {
                        inputFileRef.current[i].click();}}}/>
                  <button className={`button-x ${content.isCompleted ? 'gray-button' : ''}`} onClick={()=>{ handleDeleteMission(i) }}>X</button>
                </div>
              )
            })
          )}
          {(!props.missionList || props.missionList.length === 0) && (
            <div className='empty-message'>미션을 추가해보세요!</div>
          )}
        </div>
        <div className="col-md-4">
          <div className="myGroup">
            <div className="myGroup-top">
              <h5>나의 그룹</h5>
              <button onClick={()=>{ props.setCreate(true) }} className="button-plus">+</button>
            </div>
            <div className='groupLine'></div>
            {props.groupList && Array.isArray(props.groupList) && props.groupList.length > 0 ? (
              props.groupList.map(function(content, i){
                const groupPrice = content.penaltyPerPoint.PenaltyPerPoint
                const returnString = groupPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return (
                  <div className="groupList" key={i}>
                    <div className='myGroupBox'>
                      <span className='myGroupPrice'>{ '₩ '+returnString }</span>
                      <span className="myGroupCount">{content.groupMemberCnt}</span>
                    </div>
                    <div className="myGroupName" onClick={()=>{
                      props.navigate('/group', { state: { pageGroupName: content.groupName.group_name } });
                    }}>{ content.groupName.group_name }</div>
                  </div>
                );
              })
            ) : (
              <div className='empty-message'>그룹에 가입해보세요!</div>
            )}
            <button className="button-mygroup" onClick={()=>{ props.setJoin(true) }}>그룹 가입하기</button>
          </div>
        </div>
      </div>
      <MissionPhoto
        photo={photo}
        setPhoto={setPhoto}
        photoSrc={photoSrc}
        photoMissionName={photoMissionName}
      />
    </div>
  )
}


function MissionPhoto(props) {
  const modalTitle = props.photoMissionName;

  return (
      <Modal show={props.photo} onHide={() => {props.setPhoto(false)}} className="main-modal">
          <Modal.Header closeButton>
              <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <img src={props.photoSrc} alt={modalTitle} style={{ width: '100%' }} />
          </Modal.Body>
      </Modal>
  );
}


// 캘린더 탭
function MyCalendar() {
  const [value, setValue] = useState(new Date());
  const [pointsData, setPointsData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/GetPersonalRecord.php');
        if (res.data) {
          const formattedData = res.data.map(entry => ({
            date: entry.date.split(' ')[0],
            point: parseInt(entry.point, 10) * (-1)
          }));
          setPointsData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const maxYAxis = 0;

  const getPointForDate = (date) => {
    const pointEntry = pointsData.find(
      (entry) => moment(entry.date).isSame(date, 'day')
    );
    return pointEntry ? parseInt(pointEntry.point, 10) : null;
  };

  const getColorForPoint = (point) => {
    if (point === null) return 'pointNull';
    if (point === 0) return 'point0';
    if (point >= -1) return 'point1';
    if (point >= -3) return 'point3';
    if (point >= -5) return 'point5';
    return 'point6';
  };

  const getChartColorForPoint = (point) => {
    if (point === null) return '#ffffff';
    if (point === 0) return '#ffffff';
    if (point >= -1) return '#E7FDED';
    if (point >= -3) return '#CFFBDB';
    if (point >= -5) return '#B7FACA';
    return '#9FF8B8';
  };

  useEffect(() => {
    const calculateWeeklyData = () => {
      const filteredData = pointsData.filter(entry => moment(entry.date).isAfter(moment().subtract(5, 'weeks')));
      
      const weeks = [];
      const weekSums = {};

      filteredData.forEach(entry => {
        const week = moment(entry.date).startOf('isoWeek').format('YYYY-MM-DD');
        if (!weekSums[week]) {
          weekSums[week] = 0;
        }
        weekSums[week] += entry.point;
      });

      for (const week in weekSums) {
        weeks.push({ week, point: weekSums[week] });
      }

      setWeeklyData(weeks);
    };
    calculateWeeklyData();
  }, [pointsData]);

  
  const getDaysOfWeekData = (startOfWeek) => {
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = startOfWeek.clone().add(i, 'days');
      const point = getPointForDate(currentDay.format('YYYY-MM-DD'));
      daysOfWeek.push({ day: currentDay.format('YYYY-MM-DD'), point });
    }
    return daysOfWeek;
  };

  useEffect(() => {
    const currentWeekStart = moment(value).startOf('isoWeek');
    const dailyData = getDaysOfWeekData(currentWeekStart);
    setDailyData(dailyData);
  }, [value, pointsData]);

  return (
    <div className='calendar-tap'>
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-5">
          <Calendar
            onChange={setValue}
            value={value}
            formatDay={(locale, date) => moment(date).format("DD")}
            className="myCalendar"
            tileContent={({ date, view }) => {
              const point = getPointForDate(date);
              return (
                <div className={`point ${getColorForPoint(point)}`}>
                  {point !== null && <span className="point-value">{point}</span>}
                </div>
              );
            }}
            tileClassName={({ date }) => {
              const point = getPointForDate(date);
              return `react-calendar__tile--${getColorForPoint(point)}`;
            }}
          />
        </div>
        <div className="col-md-5 myChartContainer">
        <div className="myCharts">
          <ResponsiveContainer>
            <BarChart
              data={dailyData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tickFormatter={(day) => moment(day).format('MM-DD')} />
              <YAxis domain={[dataMin => (dataMin < 0 ? dataMin : 0), 0]} tickCount={5} />
              <Tooltip />
              <Bar
                dataKey="point"
                fill="#87F6A6"
              >
                {dailyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getChartColorForPoint(entry.point)} />
                ))}
              </Bar>
            </BarChart>
            <LineChart
              data={weeklyData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tickFormatter={(week) => `${moment(week).format('YYYY-MM-DD')}~`} />
              <YAxis domain={[dataMin => (dataMin < 0 ? dataMin : 0), 0]} tickCount={5} />
              <Tooltip labelFormatter={(value) => `${moment(value).format('YYYY-MM-DD')}~${moment(value).add(6, 'days').format('YYYY-MM-DD')}`} />
              <Line
                type="linear"
                dataKey="point"
                stroke="#30C88B"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        </div>
        <div className="col-md-1"></div>
      </div>
    </div>
  );
}



function CreateGroup(props) {
  const [isSelectPrice, setIsSelectPrice] = useState(Array(6).fill(false));
  const [groupName, setGroupName] = useState('');
  const [groupNotice, setGroupNotice] = useState('');
  const [groupPassword, setGroupPassword] = useState('');
  const [isGroupNameUnique, setIsGroupNameUnique] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const priceArr = ['₩ 0', '₩ 500', '₩ 1,000', '₩ 2,000', '₩ 3,000', '₩ 5,000'];

  useEffect(() => {
    const checkGroupName = async () => {
      if (groupName) {
        try {
          const response = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/GroupNameCheck.php', { groupName });
          setIsGroupNameUnique(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    checkGroupName();
  }, [groupName]);

  useEffect(() => {
    const regex = /^[0-9]{4,10}$/;
    setIsPasswordValid(groupPassword === '' || regex.test(groupPassword));
  }, [groupPassword]);

  useEffect(() => {
    if (!props.create) {
      setGroupName('');
      setGroupNotice('');
      setGroupPassword('');
      setIsSelectPrice(Array(6).fill(false));
      setIsGroupNameUnique(true);
      setIsPasswordValid(true);
    }
  }, [props.create]);
  
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
      const response = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/CreateGroup.php', {
        group_name: groupName,
        penaltyPerPoint: selectedPrice,
        group_notice: groupNotice,
        group_password: groupPassword
      });
      if (response.data == true) {
        alert('[ '+groupName+' ] 그룹이 생성되었습니다!')
        props.setCreate(false);
        fetchGroups(props.setGroupList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal show={props.create} onHide={() => props.setCreate(false)} className='main-modal modal-xl'>
      <Modal.Header closeButton>
        <Modal.Title className='main-modal-title'>그룹 생성</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-creategroup">
        <form onSubmit={handleSubmit}>
          <div className='modal-div'>
            <h5>그룹 이름</h5>
            <input
              className="input-groupname"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="그룹 이름을 작성해주세요!"
            />
            {!isGroupNameUnique && <p className='error-message'>이미 존재하는 그룹입니다.</p>}
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
              onChange={(e) => setGroupPassword(e.target.value)}
              placeholder="비밀번호를 숫자로 작성해주세요!"
            />
            {!isPasswordValid && <p className='error-message'>비밀번호는 4~10자의 숫자로 작성해주세요!</p>}
          </div>
          <Modal.Footer>
            <Button
              type='submit'
              className={`button-group ${!groupName || !groupNotice || !groupPassword || isSelectPrice.indexOf(true) === -1 || !isGroupNameUnique || !isPasswordValid? 'button-disabled' : ''}`}
              variant="secondary"
              disabled={!groupName || !groupNotice || !groupPassword || isSelectPrice.indexOf(true) === -1 || !isGroupNameUnique || !isPasswordValid}
            >
              그룹 만들기
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
}


// 그룹 가입 모달
function JoinGroup(props) {
  const onClickJoin = (event) => {
    event.preventDefault();
    const nameIsEmpty = checkField('name', '그룹 이름을 입력해주세요.');
    const passwordIsEmpty = checkField('password', '비밀번호를 입력해주세요.');
  
    if (!nameIsEmpty && !passwordIsEmpty) {
        const inputName = document.getElementById('name').value;
        const inputPw = document.getElementById('password').value;
  
        axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/EnterGroup.php',
        {
            group_name: inputName,
            group_password: inputPw
        })
        .then((res)=>{
            if (res.data == true) {
                alert('[ '+inputName+' ] 그룹에 가입되었습니다!')
                props.setJoin(false)
                fetchGroups(props.setGroupList);
            }
            else {
                alert('그룹 이름 또는 비밀번호를 확인해주세요.')
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }
  }
  
  const checkField = (fieldId, checkText) => {
    let fieldValue = document.getElementById(fieldId).value;
    if (fieldValue == '') {
        alert(checkText)
        return true
    }
    else{
        return false
    }
  }

  return (
    <Modal show={props.join} onHide={() => props.setJoin(false)} className="main-modal">
      <Modal.Header closeButton>
        <Modal.Title className='main-modal-title'>그룹 가입</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-joingroup'>
        <input type="text" placeholder="그룹 이름" id="name"></input>
        <input type="password" placeholder="PASSWORD" id="password"></input>
        <button className='button-join' onClick={onClickJoin}>그룹 가입하기</button>
      </Modal.Body>
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
        props.setChange(false);
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


export default App;