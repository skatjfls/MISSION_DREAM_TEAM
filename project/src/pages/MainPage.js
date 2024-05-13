import axios from 'axios';
import React, {useState, useEffect, useContext} from "react";
import moment from "moment";
import { Button, Modal, Nav } from 'react-bootstrap';
import Calendar from "react-calendar";
import { useDispatch,useSelector } from 'react-redux';
import { resetUser } from '../store/reducers/userReducer';


function MainPage({userName, point, navigate}){
    let [create, setCreate] = useState(false);
    let [tap, setTap] = useState(0);
    let [join, setJoin] = useState(false);
    const [newMission, setNewMission] = useState('');
    let [missionInput, setMissionInput] = useState('');
    let [missionList, setMissionList] = useState([]);
    let [groupList] = useState(['그지깽깽이들', '그만 좀 먹어라', '예쁜말 고운말']);

    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.userId);

    if (userId == null){
      navigate('/login');
    }

    const handleAddMission = async () => {
        try {
          // 새로운 미션 추가
          const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/Insert_mission.php', {
            mission: newMission, // 미션 내용
          });
          console.log('insert_mission',res)
    
          // 미션 목록 갱신
          setMissionList([...missionList, newMission]);
          // 입력 필드 초기화
          setNewMission('');
        } catch (error) {
          console.error('Error adding mission:', error);
        }
      };

    const handleInputChange = (event) => {
        setNewMission(event.target.value); // 입력 필드의 내용 변경 시 상태 업데이트
    };

      return (
        <div>
              <div className="nav-bar">
                <img className="img-logo" onClick={()=>{navigate('/')}} src="/img/dream.png"/>
                <div>
                  <h6>{ userName }</h6>
                  <h6>{ point } point</h6>
                  <img className="imgs" src="/img/gear.png"/>
                  <button className="button-logout" onClick={()=>{dispatch(resetUser()); navigate('/login')}}>로그아웃</button>
                </div>
              </div>
              <div className="main-top">
                {
                  tap == 0? <>
                    <h1>To do list</h1>
                    <input className="input-todo" type="text" value={missionInput} onChange={(e)=>{ setMissionInput(e.target.value) }}placeholder="오늘의 할 일을 작성하세요!"></input>
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
                tap == 0 ? <ToDo setCreate={setCreate} setJoin={setJoin} groupList={groupList} missionList={missionList} setMissionList={setMissionList} navigate={navigate} newMission={newMission} setNewMission={setNewMission}/> : null
              }
              {
                tap == 1 ? <MyCalendar/> : null
              }
            <CreateGroup create={create} setCreate={setCreate}/>
            <JoinGroup join={join} setJoin={setJoin}/>
        </div>
      );
}

// Todo 탭
function ToDo(props) {
    let [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const fetchMissions = async () => {
        try {
            const res = await axios.get(`http://localhost/MISSION_DREAM_TEAM/PHP/Show_mission.php?`)
            console.log('show_mission',res)
            props.setMissionList(res.data)
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching missions:', error)
            setIsLoading(false)
        }
      }
      fetchMissions();
    }, [props.missionList]);
    
    return(
      <div className="todo-tap">
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            {props.missionList && props.missionList.length > 0 && (
              props.missionList.map(function(content, i){
                return (
                  <div className="mission" key={i}>
                    <input type="checkbox"/>
                    <h6 id={ content }>{ content }</h6>
                    <img className="imgs" src="/img/camera.png"/>
                    <button className="button-x" onClick={()=>{ let copy = [...props.missionList]; copy.splice(i, 1); props.setMissionList(copy); }}>X</button>
                  </div>
                )
              })
            )}
            {(!props.missionList || props.missionList.length === 0) && (
              <div className='empty-mission'>미션을 추가해보세요!</div>
            )}
          </div>
          <div className="col-md-4">
            <div className="myGroup">
              <div className="myGroup-top">
                <h5>나의 그룹</h5>
                <button onClick={()=>{ props.setCreate(true) }} className="button-plus">+</button>
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
    return (
      <Modal show={props.create} onHide={() => props.setCreate(false)} className='modal modal-xl'>
        <Modal.Header closeButton>
          <Modal.Title>그룹 생성</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-creategroup">
          <div className='modal-div'>
            <h5>그룹 이름</h5>
            <input className="input-groupname" type="text" placeholder="그룹 이름을 작성해주세요!"></input>
            <p>이미 존재하는 이름입니다.</p>
          </div>
          <div className='modal-div'>
            <h5>포인트 별 금액</h5>
            <div>
              <span>₩0</span><span>₩500</span><span>₩1,000</span><span>₩2,000</span><span>₩3,000</span><span>₩5,000</span>
              <div className='modal-p'>
                <p>동기부여를 위해 포인트별 금액을 설정해보세요! 벌금처럼 걷어서 회식이나 1/n을 해도 좋고, 꼴등이 1등에게 쏘기도 좋아요!</p>
                <p>벌금이 부담스럽다면 0원으로 설정 후 상벌을 정해보세요.</p>
              </div>
            </div>
          </div>
          <div className='modal-div'>
            <h5>그룹 공지사항</h5>
            <textarea placeholder="그룹 내에서 지켜야 할 규칙을 작성해주세요."></textarea>
          </div>
          <div className='modal-div'>
            <h5>가입 비밀번호</h5>
            <input className="input-grouppw" type="password" placeholder="비밀번호를 숫자로 작성해주세요!"></input>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="button-group" variant="secondary">
            그룹 만들기
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  // 그룹 가입 모달
  function JoinGroup(props) {
    return (
      <Modal show={props.join} onHide={() => props.setJoin(false)} className="modal">
        <Modal.Header closeButton>
          <Modal.Title>그룹 가입</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal-joingroup'>
          <input type="text" placeholder="그룹 이름"></input>
          <input type="password" placeholder="PASSWORD"></input>
          <button className='button-join'>그룹 가입하기</button>
        </Modal.Body>
      </Modal>
    );
  }

export default MainPage;