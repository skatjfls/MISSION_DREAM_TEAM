import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateInfo.css';

const UpdateInfoForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        CurPassword: '',
        newPassword: '',
        repassword: '',
        nickName: ''
    });

    const [formErrors, setFormErrors] = useState({
        id: '',
        CurPassword: '',
        newPassword: '',
        repassword: '',
        nickName: ''
    });

    const [isNameDuplicateChecked, setIsNameDuplicateChecked] = useState(false);
    const [formIsValid, setFormIsValid] = useState(false);
    const [isLoggedIN, setIsLoggedIN] = useState(false);
    const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userRes = await axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/GetInfo.php');
                const userInfo = userRes.data;
                setUserName(userInfo.name);
                setFormData(prevData => ({ ...prevData, nickName: userInfo.name }));
                const idRes = await axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/GetId.php');
                const userId = idRes.data;
                setFormData(prevData => ({ ...prevData, id: userId }));
                setIsNameDuplicateChecked(true);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    
        if (name === 'nickName') {
            if (value === userName) {
                setIsNameDuplicateChecked(true); // 기존 닉네임으로 설정 시 자동 통과
            } else {
                setIsNameDuplicateChecked(false); // 닉네임이 변경되면 중복 확인 필요
            }
        }
    
        validateField(name, value);
    };

    const validateField = (fieldName, value) => {
        const errors = { ...formErrors };
        switch (fieldName) {
            case 'CurPassword':
                errors.CurPassword = value && value.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/) ? '' : '영문, 숫자, 특수기호를 모두 포함하여 8~20자로 작성하여야 합니다.';
                break;
            case 'newPassword':
                errors.newPassword = value && value.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/) ? '' : '영문, 숫자, 특수기호를 모두 포함하여 8~20자로 작성하여야 합니다.';
                break;
            case 'repassword':
                errors.repassword = value === formData.newPassword ? '' : '비밀번호가 일치하지 않습니다.';
                break;
            case 'nickName':
                errors.nickName = value && value.match(/^(?=.*[a-zA-Z가-힣]).{2,10}$/) ? '' : '영문 혹은 한글을 포함하여 2~10자로 작성하여야 합니다.';
                break;
            default:
                break;
        }
        setFormErrors(errors);
        validateForm();
    };

    useEffect(() => {
        validateForm();
    }, [formData, isNameDuplicateChecked]);

    const validateForm = () => {
        const passwordIsValid = formData.CurPassword.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/);
        const newPasswordIsValid = !showNewPasswordFields || (formData.newPassword === '' || (formData.newPassword.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/) && formData.repassword === formData.newPassword));
        const nickNameIsValid = formData.nickName === '' || (formData.nickName.match(/^(?=.*[a-zA-Z가-힣]).{2,10}$/) && isNameDuplicateChecked);
    
        const isFormValid = passwordIsValid && newPasswordIsValid && nickNameIsValid;
        setFormIsValid(isFormValid);
    };
      
    const handleCheckDuplicateNickName = async () => {
        // 입력된 닉네임이 기존의 닉네임과 같은지 확인하고 같으면 자동 중복 통과
        if (formData.nickName === userName) {
            alert(`${formData.nickName}은(는) 현재 닉네임으로, 사용 가능합니다.`);
            setIsNameDuplicateChecked(true);
            return;
        }
    
        const nameValidationResult = formData.nickName && formData.nickName.match(/^(?=.*[a-zA-Z가-힣]).{2,10}$/);
        if (nameValidationResult) {
            try {
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/NickNameCheck.php', {
                    nickName: formData.nickName
                });
                console.log(res.data);
                if (res.data === true) {
                    alert(`${formData.nickName}은(는) 이미 사용중인 닉네임입니다.`);
                    setIsNameDuplicateChecked(false);
                } else {
                    alert(`${formData.nickName}은(는) 사용 가능한 닉네임입니다.`);
                    setIsNameDuplicateChecked(true);
                }
            } catch (error) {
                console.error('Error checking duplicate:', error);
                alert('닉네임 중복 확인 중 오류가 발생했습니다.');
                setIsNameDuplicateChecked(false);
            }
        } else {
            alert(`닉네임의 입력 조건을 확인해주세요.`);
            setIsNameDuplicateChecked(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        validateForm();
    
        console.log('Form submission status: ', formIsValid);
    
        if (formIsValid) {
            try {
                // 새 비밀번호가 비어있는 경우 null을 전달하고, 그렇지 않은 경우 실제 값을 전달
                const newPasswordToSend = formData.newPassword === '' ? null : formData.newPassword;
    
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/UpdateInfo.php', {
                    newName: formData.nickName,
                    CurPassword: formData.CurPassword,
                    newPassword: newPasswordToSend
                });
                console.log(res.data);
    
                if (res.data === true) {
                    alert('회원정보 수정에 성공했습니다.');
                    console.log(formData.nickName, formData.CurPassword, newPasswordToSend);
                    navigate('/login');
                } else {
                    alert('회원정보 수정에 실패했습니다.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('회원가입 중 오류가 발생했습니다.');
            }
        } else {
            console.log('Form is invalid, cannot submit.');
        }
    };

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
                setUserName(userData.name);  // userName 상태 업데이트
                setFormData(prevData => ({ ...prevData, nickName: userData.name }));  // formData에 nickName 초기화
                setIsNameDuplicateChecked(true);  // 이미 사용 중인 nickName으로 초기화
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        checkLoginState();
        fetchUserInfo();
    }, []);

    // 계정 탈퇴
    const handleMemberExit = async () => {
        const confirmed = window.confirm("탈퇴하면 머리카락 3가닥 빠져요");
        if (confirmed) {
            try {
                await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ExitMember.php');
                alert("잘가요");
                // 로그인창으로 이동
                navigate('/login')
            } catch (err) {
                console.error('탈퇴 실패!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 히히히', err);
            }
        } else {
            // 아니오를 클릭한 경우 그냥 무시
            console.log("탈퇴안해줄거지롱");
        }
    };

    return (
        <div className="background">
            <div className="input">
                <h1 className="mb-4 signUpTitle">회원정보 수정</h1>
                <p className="signUpExplain">비밀번호나 닉네임을 변경할 수 있습니다!</p>
                <Form onSubmit={handleSubmit} id='formdata'>
                    <Form.Group className="form-group" controlId="formBasicID">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> ID</Form.Label>
                            <Form.Text className="error-message">{formErrors.id}</Form.Text>
                        </div>
                        <Form.Control
                            className="form-control" type="text" name="id" value={formData.id} onChange={handleChange} disabled/>
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formBasicPassword">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> 기존 Password</Form.Label>
                            <Form.Text className="error-message">{formErrors.CurPassword}</Form.Text>
                        </div>
                            <Form.Control className="form-control" type="password" name="CurPassword" placeholder="기존 PW 입력 (8~20자)" value={formData.CurPassword} onChange={handleChange} required />
                    </Form.Group>
                    <Button variant="secondary" onClick={() => setShowNewPasswordFields(!showNewPasswordFields)} className="mb-3">
                        비밀번호 바꾸기
                    </Button>
                    {showNewPasswordFields && (
                        <>
                            <Form.Group className="form-group" controlId="formBasicNewPassword">
                                <Form.Label className={`form-label ${showNewPasswordFields ? 'visible' : ''}`}>새 Password</Form.Label>
                                <Form.Control className="form-control" type="password" name="newPassword" placeholder="새 PW 입력 (8~20자)" value={formData.newPassword} onChange={handleChange} />
                                <Form.Text className="error-message">{formErrors.newPassword}</Form.Text>
                            </Form.Group>
                            <Form.Group className="form-group" controlId="formBasicReNewPassword">
                                <Form.Label className={`form-label ${showNewPasswordFields ? 'visible' : ''}`}>비밀번호 재입력</Form.Label>
                                <Form.Control className="form-control" type="password" name="repassword" placeholder="새 PW 재입력" value={formData.repassword} onChange={handleChange} />
                                <Form.Text className="error-message">{formErrors.repassword}</Form.Text>
                            </Form.Group>
                        </>
                    )}
                    <Form.Group className="form-group" controlId="formBasicNickName">
                        <div className="labelAlign">
                            <Form.Label className="form-label"> 새 닉네임</Form.Label>
                            <Form.Text className="error-message">{formErrors.nickName}</Form.Text>
                        </div>
                        <Row>
                            <Col xs={8}>
                                <Form.Control className="form-control" type="text" name="nickName" value={formData.nickName} onChange={handleChange} />
                            </Col>
                            <Col xs={4}>
                                <Button className={`check-duplicate ${isNameDuplicateChecked ? 'button-change' : ''}`} variant="secondary" onClick={handleCheckDuplicateNickName}><b>닉네임 중복 확인</b></Button>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Button className="complete" variant="primary" type="submit" disabled={!formIsValid}>수정완료 </Button>
                </Form>
                <button className="button-exit" onClick={handleMemberExit}>서비스 탈퇴하기</button>
            </div>
        </div>
    );
};

export default UpdateInfoForm;