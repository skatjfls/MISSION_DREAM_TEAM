import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import axios from 'axios';

const SignUpForm = () => {
    const navigate = useNavigate();
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
    const [formIsValid, setFormIsValid] = useState(false);
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
                errors.id = value.match(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/) ? '' : '영문과 숫자를 모두 포함하여 6~20자로 작성하여야 합니다.';
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
        validateForm();
    };

    useEffect(() => {
        validateForm();
    }, [isIDDuplicateChecked, isNameDuplicateChecked]);

    const validateForm = () => {
        const idIsValid = formData.id.match(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/);
        const passwordIsValid = formData.password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/);
        const nameIsValid = formData.name.match(/^([a-zA-Z가-힣]{1,}).{1,9}$/);
        const isValid = idIsValid && passwordIsValid && nameIsValid && formData.id !== '' && formData.password !== '' && formData.name !== '' && formData.repassword === formData.password && isIDDuplicateChecked && isNameDuplicateChecked;

        setFormIsValid(isValid);
    };

    const handleCheckDuplicateID = async () => {
        const idValidationResult = formData.id.match(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/);
        if (idValidationResult) {
            try {
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/IdCheck.php', {
                    id: formData.id
                });
                console.log(res.data);
                if (res.data === true) {
                    alert(`${formData.id}는 이미 사용중인 아이디입니다.`);
                    setIsIDDuplicateChecked(false);
                } else {
                    alert(`${formData.id}는 사용 가능한 아이디입니다.`);
                    setIsIDDuplicateChecked(true);
                }
            } catch (error) {
                console.error('Error checking duplicate:', error);
                alert('아이디 중복 확인 중 오류가 발생했습니다.');
            }
        } else {
            alert(`${formData.id}의 입력 조건을 확인해주세요.`);
            setIsIDDuplicateChecked(false);
        }
    };

    const handleCheckDuplicateNickName = async () => {
        const nameValidationResult = formData.name.match(/^([a-zA-Z가-힣]{1,}).{1,9}$/);
        if (nameValidationResult) {
            try {
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/NickNameCheck.php', {
                    nickName: formData.name
                });
                console.log(res.data);
                if (res.data === true) {
                    alert(`${formData.name}는 이미 사용중인 닉네임입니다.`);
                    setIsNameDuplicateChecked(false);
                } else {
                    alert(`${formData.name}는 사용 가능한 닉네임입니다.`);
                    setIsNameDuplicateChecked(true);
                }
            } catch (error) {
                console.error('Error checking duplicate:', error);
                alert('닉네임 중복 확인 중 오류가 발생했습니다.');
            }
        } else {
            alert(`${formData.name}의 입력 조건을 확인해주세요.`);
            setIsNameDuplicateChecked(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const idIsValid = formData.id.match(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/);
        const passwordIsValid = formData.password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/);
        const nameIsValid = formData.name.match(/^([a-zA-Z가-힣]{1,}).{1,9}$/);
        const isValid = idIsValid && passwordIsValid && nameIsValid && formData.id !== '' && formData.password !== '' && formData.name !== '' && formData.repassword === formData.password && isIDDuplicateChecked && isNameDuplicateChecked;

        if (isValid) {
            try {
                const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/SignUp.php', {
                    id: formData.id,
                    password: formData.password,
                    name: formData.name
                });
                console.log(res.data);

                if (res.data === true) {
                    alert('회원가입에 성공했습니다.');
                    navigate('/login');
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
                        <Button className={`check-duplicate ${isIDDuplicateChecked ? 'button-red' : ''}`} variant="secondary" onClick={handleCheckDuplicateID}><b>ID 중복 확인</b></Button>
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formBasicPassword">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> Password</Form.Label>
                            <Form.Text className="error-message">{formErrors.password}</Form.Text>
                        </div>
                        <Form.Control className="form-control" type="password" name="password" placeholder="PW 입력 (8~20자)" value={formData.password} onChange={handleChange} required />
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
                        <Button className={`check-duplicate ${isNameDuplicateChecked ? 'button-red' : ''}`} variant="secondary" onClick={handleCheckDuplicateNickName}><b>닉네임 중복 확인</b></Button>
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
