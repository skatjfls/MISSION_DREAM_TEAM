import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import './SignUp.css';

import axios from 'axios';

const SignUpForm = () => {
    const navigate = useNavigate(); // useHistory 대신 useNavigate 사용
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        repassword: '',
        name: ''
    });

    const [formErrors, setFormErrors] = useState({
        id: '',
        password: '',
        repassword: '',
        name: ''
    });

    const [isIDDuplicateChecked, setIsIDDuplicateChecked] = useState(false);
    const [isNameDuplicateChecked, setIsNameDuplicateChecked] = useState(false);
    const [formIsValid, setFormIsValid] = useState(false); // 폼의 전체 유효성 검사 상태

    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const validateField = (fieldName, value) => {
        const errors = { ...formErrors };
        switch (fieldName) {
            case 'id':
                errors.id = value.match(/^[a-zA-Z][a-zA-Z\d!@#$%^&*]{6,20}$/) ? '' : '영문, 숫자를 모두 포함하여 6~20자로 작성하여야 합니다.';
                break;
            case 'password':
                errors.password = value.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/) ? '' : '영문, 숫자, 특수기호를 모두 포함하여 8~20자로 작성하여야 합니다.';
                break;
            case 'repassword':
                errors.repassword = value === formData.password ? '' : '비밀번호가 일치하지 않습니다.';
                break;
            case 'name':
                errors.name = value.match(/^([a-zA-Z가-힣]{1,}).{1,9}$/) ? '' : '영문 혹은 한글을 포함하여 2~10자로 작성하여야 합니다.';
                break;
            default:
                break;
        }
        setFormErrors(errors);

        // 모든 필드의 유효성 검사가 성공하고 중복 확인도 완료되었을 때 가입 완료 버튼 활성화
        const isAllValid = Object.values(errors).every(error => error === '');
        if (isAllValid && isIDDuplicateChecked && isNameDuplicateChecked) {
            setFormIsValid(true);
        } else {
            setFormIsValid(false);
        }
    };
        // 중복 확인 상태 변수가 변경될 때마다 폼의 유효성을 검사하는 함수
        useEffect(() => {
            validateForm();
        }, [isIDDuplicateChecked, isNameDuplicateChecked]);

        const validateForm = () => {
            const idIsValid = formData.id.match(/^[a-zA-Z0-9]{6,20}$/);
            const nameIsValid = formData.name.match(/^([a-zA-Z가-힣]{1,}).{1,9}$/);
            const isValid = Object.values(formErrors).every(error => error === '') && idIsValid && nameIsValid && formData.id !== '' && formData.name !== '' && isIDDuplicateChecked && isNameDuplicateChecked;

            setFormIsValid(isValid);
        };

    const handleCheckDuplicateID = async () => {
        const idValidationResult = formData.id.match(/^[a-zA-Z0-9]{6,20}$/);
        if (idValidationResult) {
            try {
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/IdCheck.php', {
                    id: formData.id // 아이디 값 전달
                });
                console.log(res.data);
                if (res.data === true) {
                    alert(`${formData.id}는 이미 사용중인 아이디입니다.`);
                    setIsIDDuplicateChecked(false); // 사용 불가능한 아이디인 경우 false로 설정
                } else {
                    alert(`${formData.id}는 사용 가능한 아이디입니다.`);
                    setIsIDDuplicateChecked(true); // 사용 가능한 아이디인 경우 true로 설정
                }
            } catch (error) {
                console.error('Error checking duplicate:', error);
                alert('아이디 중복 확인 중 오류가 발생했습니다.');
            }
        } else {
            alert(`${formData.id}의 입력 조건을 확인해주세요.`);
            setIsIDDuplicateChecked(false); // 입력 조건에 맞지 않는 경우 false로 설정
        }
    };
    
    
    const handleCheckDuplicateNickName = async () => {
        const nameValidationResult = formData.name.match(/^([a-zA-Z가-힣]{1,}).{1,9}$/);
        if (nameValidationResult) {
            try {
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/NickNameCheck.php', {
                    nickName: formData.name // 닉네임 값 전달
                });
                console.log(res.data);
                if (res.data === true) {
                    alert(`${formData.name}는 이미 사용중인 닉네임입니다.`);
                    setIsNameDuplicateChecked(false); // 사용 불가능한 닉네임인 경우 false로 설정
                } else {
                    alert(`${formData.name}는 사용 가능한 닉네임입니다.`);
                    setIsNameDuplicateChecked(true); // 사용 가능한 닉네임인 경우 true로 설정
                }
            } catch (error) {
                console.error('Error checking duplicate:', error);
                alert('닉네임 중복 확인 중 오류가 발생했습니다.');
            }
        } else {
            alert(`${formData.name}의 입력 조건을 확인해주세요.`);
            setIsNameDuplicateChecked(false); // 입력 조건에 맞지 않는 경우 false로 설정
        }
    };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const idIsValid = formData.id.match(/^[a-zA-Z0-9]{6,20}$/);
        const nameIsValid = formData.name.match(/^([a-zA-Z가-힣]{1,}).{1,9}$/);
        const isValid = Object.values(formErrors).every(error => error === '') && idIsValid && nameIsValid && formData.id !== '' && formData.name !== '' && isIDDuplicateChecked && isNameDuplicateChecked;

        if (isValid) {
            try {
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/SignUp.php', {
                    id: formData.id,
                    password: formData.password,
                    name: formData.name
                });
                console.log("sdafsdfsfds", res.data);

                if (res.data === true) {
                    alert('회원가입에 성공했습니다.');
                    // 회원가입에 성공하면 App.js로 이동
                    navigate('/');
                } else {
                    alert('회원가입에 실패했습니다.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('회원가입 중 오류가 발생했습니다.');
            }
        } else {
            console.log('Form is invalid, cannot submit.');
        }
    };

    return (
        <div className="background">
            <div className="input">
                <h1 className="mb-4 signUpTitle">회원가입</h1>
                <p className="signUpExplain">회원이 되어 다양한 혜택을 누려보세요!</p>
                <Form onSubmit={handleSubmit} id='formdata'>
                    <Form.Group className="form-group" controlId="formBasicId">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> ID</Form.Label>
                            <Form.Text className="error-message">{formErrors.id}</Form.Text>
                        </div>
                        <Form.Control className="form-control" type="text" name="id" placeholder="ID 입력 (6~20자)" value={formData.id} onChange={handleChange} required />
                        <Button className="check-duplicate" variant="secondary" onClick={handleCheckDuplicateID}>ID 중복 확인</Button>
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formBasicPassword">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> Password</Form.Label>
                            <Form.Text className="error-message">{formErrors.password}</Form.Text>
                        </div >
                        <Form.Control className="form-control" type="password" name="password" placeholder="PW 입력 (영문, 숫자, 특수기호 포함 8~20자)" value={formData.password} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formBasicConfirmPassword">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> Password 확인</Form.Label>
                            <Form.Text className="error-message">{formErrors.repassword}</Form.Text>
                        </div>
                        <Form.Control className="form-control" type="password" name="repassword" placeholder="PW 재입력" value={formData.repassword} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formBasicName">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> 닉네임</Form.Label>
                            <Form.Text className="error-message">{formErrors.name}</Form.Text>
                        </div>
                        <Form.Control className="form-control" type="text" name="name" placeholder="한글로 입력" value={formData.name} onChange={handleChange} required />
                        <Button className="check-duplicate" variant="secondary" onClick={handleCheckDuplicateNickName}>닉네임 중복 확인</Button>
                    </Form.Group>
                    <Button className="complete" variant="primary" type="submit" disabled={!formIsValid}>
                        가입완료
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default SignUpForm;

