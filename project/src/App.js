import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Nav } from 'react-bootstrap';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Route, Routes, useNavigate } from 'react-router-dom';
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

  let [userName, setUserName] = useState();
  let [point, setPoint] = useState();
  let [missionInput, setMissionInput] = useState('');
  let [tap, setTap] = useState(0);
  let navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/CheckLoginState.php')
    .then(res => {
      console.log('로그인 상태 : ',res);
      if(res.data === false){
        navigate('/login');
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
        const missionCnt = userData.totalMissionCnt - userData.noMissionCnt
        const string = missionCnt  + ' / ' + userData.totalMissionCnt;
        setPoint(string);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  });

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
      console.log('insert_mission',res)
    
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
        <Route path="/" element={
          <div>
            <div className="nav-bar">
              <img className="img-logo" onClick={()=>{navigate('/')}} src="/img/dream.png"/>
              <div>
                <h6>{ userName }</h6>
                <h6>오늘의 미션 : { point }</h6>
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
            <div className="main-top">
              {
                tap == 0? <>
                  <h1>To do list</h1>
                  <input className="input-todo" type="text" value={missionInput} onChange={(e)=>{ setMissionInput(e.target.value)}}placeholder="오늘의 할 일을 작성하세요!"></input>
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
              tap == 0 ? <ToDo setCreate={setCreate} setJoin={setJoin} groupList={groupList} missionList={missionList} setMissionList={setMissionList} setGroupList={setGroupList} navigate={navigate}/> : null
            }
            {
              tap == 1 ? <MyCalendar/> : null
            }
          </div>
        }/>
        <Route path="/login" element={ <LogIn navigate={navigate}/> }/>
        <Route path="/signup" element={ <SignUp/> }/>
        <Route path="/group" element={ <Group/> }/>
        <Route path="/updateinfo" element={ <UpdateInfo/> }/>
        <Route path="*" element={<div>404</div>}/>
      </Routes>
      <CreateGroup create={create} setCreate={setCreate}/>
      <JoinGroup join={join} setJoin={setJoin} setGroupList={setGroupList}/>
    </div>
  );
}


const fetchMissions = async (setMissionList) => {
  try {
      const res = await axios.get(`http://localhost/MISSION_DREAM_TEAM/PHP/Show_mission.php?`)
      const missions = res.data.map(mission => ({
        ...mission,
        isCompleted: mission[4] === 1
      }));
      setMissionList(missions);
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
  
  useEffect(() => {
    fetchMissions(props.setMissionList);
    fetchGroups(props.setGroupList);
  }, []);
  
  const handleDeleteMission = async (i) => {
    try {
      const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/Delete_mission.php', {
        mission_idx: props.missionList[i][0]
      })
      fetchMissions(props.setMissionList);
    } catch (error) {
      console.error('Error deleting mission:', error);
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
      console.log('Image uploaded:', res.data);
      if (res.data == true) {
        props.setMissionList(prevMissions => {
          const newMissions = [...prevMissions];
          newMissions[index].isCompleted = true;
          return newMissions;
        });
      }
      inputFileRef.current[index].value = "";
    } catch (error) {
      console.error('Error uploading image:', error);
    }
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
                  <img className="imgs" src={content.isCompleted ? "/img/camera_gray.png" : "/img/camera.png"} onClick={() => inputFileRef.current[i].click()} />
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
                    <span className='myGroupPrice'>{ '₩ '+returnString }</span>
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
    </div>
  )
}


// 캘린더 탭
function MyCalendar() {
  let [value, setValue] = useState(new Date());
  return (
    <div className='calendar-tap'>
      <Calendar
        onChange={setValue}
        value={value}
        formatDay={(locale, date) => moment(date).format("DD")}
      ></Calendar>
      <div>
        {moment(value).format("YYYY년 MM월 DD일")}
      </div>
    </div>
  );
}

// 그룹 생성 모달
function CreateGroup(props) {
  const [isSelectPrice, setIsSelectPrice] = useState(Array(6).fill(false));
  const [groupName, setGroupName] = useState('');
  const [notice, setNotice] = useState('');
  const [groupPassword, setGroupPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [validationOrder, setValidationOrder] = useState(['groupName', 'selectedPrice', 'notice', 'groupPassword']);
  const priceArr = ['₩ 0', '₩ 500', '₩ 1,000', '₩ 2,000', '₩ 3,000', '₩ 5,000']

  const handleClickPrice = (idx) => {
    const newArr = Array(priceArr.length).fill(false);
    newArr[idx] = true;
    setIsSelectPrice(newArr);
  }

  const handleGroupNameChange = (e) => {
    const value = e.target.value;
    setGroupName(value);
    validateFields('groupName');
  };

  const handleNoticeChange = (e) => {
    const value = e.target.value;
    setNotice(value);
    validateFields('notice');
  };

  const handleGroupPasswordChange = (e) => {
    const value = e.target.value;
    setGroupPassword(value);
    validateFields('groupPassword');
  };

  const validateFields = (changedField) => {
    validateField(changedField);
  };

  const validateField = (field) => {
    const value = getFieldData(field);
    const errors = { ...validationErrors };

    switch (field) {
      case 'groupName':
        errors.groupName = !value ? '그룹 이름을 입력해주세요!' : '';
        break;
      case 'selectedPrice':
        errors.selectedPrice = value === -1 ? '포인트 별 금액을 선택해주세요!' : '';
        break;
      case 'notice':
        errors.notice = !value ? '그룹 공지사항을 작성해주세요!' : '';
        break;
      case 'groupPassword':
        errors.groupPassword = !value ? '비밀번호를 입력해주세요!' : '';
        break;
      default:
        break;
    }

    setValidationErrors(errors);
  };

  const getFieldData = (field) => {
    switch (field) {
      case 'groupName':
        return groupName;
      case 'selectedPrice':
        return isSelectPrice.indexOf(true);
      case 'notice':
        return notice;
      case 'groupPassword':
        return groupPassword;
      default:
        return null;
    }
  };

  const validate = () => {
    const selectedPriceIndex = isSelectPrice.indexOf(true);
    validateField('groupName');
    validateField('selectedPrice');
    validateField('notice');
    validateField('groupPassword');

    return Object.values(validationErrors).every(error => error === '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const selectedPrice = priceArr[isSelectPrice.indexOf(true)];

    try {
      const response = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/CreateGroup.php', {
        group_name: groupName,
        penaltyPerPoint: selectedPrice,
        group_notice: notice,
        group_password: groupPassword
      });

      if (response.data.success) {
        props.setCreate(false);
        setGroupName('');
        setNotice('');
        setGroupPassword('');
        setIsSelectPrice(Array(priceArr.length).fill(false));
        setValidationErrors({});
      } else {
        setValidationErrors({ server: response.data.message });
      }
    } catch (error) {
      setValidationErrors({ server: '서버와의 통신 중 오류가 발생했습니다.' });
    }
  };

  return (
    <Modal show={props.create}
    onHide={() => {
      props.setCreate(false);
      setIsSelectPrice(Array(priceArr.length).fill(false));
      setGroupName('');
      setNotice('');
      setGroupPassword('');
      setValidationErrors({});
      }}
      className='main-modal modal-xl'>
      <Modal.Header closeButton>
        <Modal.Title className='main-modal-title'>그룹 생성</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-creategroup">
        <form onSubmit={handleSubmit}>
          <div className='modal-div'>
            <h5>그룹 이름</h5>
            <input className="input-groupname" type="text" placeholder="그룹 이름을 작성해주세요!" value={groupName} onChange={handleGroupNameChange}></input>
            {validationErrors.groupName && <p className='error-message'>{validationErrors.groupName}</p>}
          </div>
          <div className='modal-div'>
            <h5>포인트 별 금액</h5>
            <div>
              <div>
                {priceArr.map((content, i) => {
                  return(
                    <button key={i} className={`button-price ${isSelectPrice[i]? 'button-price-clicked' : ''}`} onClick={() => handleClickPrice(i) }>{ content }</button>
                  );
                })}
              </div>
              <div className='modal-p'>
                <p>동기부여를 위해 포인트별 금액을 설정해보세요! 벌금처럼 걷어서 회식이나 1/n을 해도 좋고, 꼴등이 1등에게 쏘기도 좋아요!</p>
                <p>벌금이 부담스럽다면 0원으로 설정 후 상벌을 정해보세요.</p>
              </div>
            </div>
            {validationErrors.selectedPrice && <p className='error-message'>{validationErrors.selectedPrice}</p>}
          </div>
          <div className='modal-div'>
            <h5>그룹 공지사항</h5>
            <textarea placeholder="그룹 내에서 지켜야 할 규칙을 작성해주세요." value={notice} onChange={handleNoticeChange}></textarea>
            {validationErrors.notice && <p className='error-message'>{validationErrors.notice}</p>}
          </div>
          <div className='modal-div'>
            <h5>가입 비밀번호</h5>
            <input className="input-grouppw" type="password" placeholder="비밀번호를 숫자로 작성해주세요!" value={groupPassword} onChange={handleGroupPasswordChange}></input>
            {validationErrors.groupPassword && <p className='error-message'>{validationErrors.groupPassword}</p>}
          </div>
          <Modal.Footer>
            <Button type='submit' className="button-group" variant="secondary">
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

export default App;