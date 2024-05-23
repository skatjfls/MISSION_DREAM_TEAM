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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    
        if (name === 'nickName' && value.trim() === '') {
            setIsNameDuplicateChecked(true);
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
        if (!formData.nickName) {
            setIsNameDuplicateChecked(true); // 비어있는 경우 바로 유효하다고 판단
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
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/UpdateInfo.php', {
                    newName: formData.nickName,
                    CurPassword: formData.CurPassword,
                    newPassword: formData.newPassword
                });
                console.log(res.data);

                if (res.data === true) {
                    alert('회원정보 수정에 성공했습니다.');
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
                const res = await axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/GetId.php');
                const userData = res.data;
                console.log("아이디 불러오기 성공", userData);
                setFormData({ ...formData, id: userData });
            } catch (error) {
                console.error('Error fetching user info:', error);
                console.log("아이디 불러오기 실패");
            }
        };

        checkLoginState();
        fetchUserInfo();
    }, []);

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
                            className="form-control" type="text" name="id" placeholder={formData.id} onChange={handleChange} disabled/>
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
                            <Form.Group className="form-group" controlId="formBasicConfirmPassword">
                                <div className="labelAlign">
                                    <Form.Label className="form-label"> 새 Password</Form.Label>
                                    <Form.Text className="error-message">{formErrors.newPassword}</Form.Text>
                                </div>
                                <Form.Control className="form-control" type="password" name="newPassword" placeholder="새 PW 입력 (8~20자)" value={formData.newPassword} onChange={handleChange} />
                                <div className="labelAlign">
                                    <Form.Label className="form-label">비밀번호 재입력</Form.Label>
                                    <Form.Text className="error-message">{formErrors.repassword}</Form.Text>
                                </div>
                                <Form.Control className="form-control" type="password" name="repassword" placeholder="새 PW 재입력" value={formData.repassword} onChange={handleChange} />
                            </Form.Group>
                        )}
                        <Form.Group className="form-group" controlId="formBasicName">
                            <div className="labelAlign">
                                <Form.Label className="form-label"> 새 닉네임</Form.Label>
                                <Form.Text className="error-message">{formErrors.nickName}</Form.Text>
                            </div>
                            <Row>
                                <Col xs={8}>
                                    <Form.Control className="form-control" type="text" name="nickName" placeholder="닉네임 입력 (2~10자)" value={formData.nickName} onChange={handleChange} />
                                </Col>
                                <Col xs={4}>
                                    <Button className={`check-duplicate ${isNameDuplicateChecked ? 'button-change' : ''}`} variant="secondary" onClick={handleCheckDuplicateNickName}><b>닉네임 중복 확인</b></Button>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Button className="complete" variant="primary" type="submit" disabled={!formIsValid}> 수정완료 </Button>
                    </Form>
                </div>
            </div>
        );
    };

    export default UpdateInfoForm;