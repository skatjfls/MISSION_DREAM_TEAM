import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import './SignUp.css';

import axios from 'axios';

const SignUpForm = () => {
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

    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (!formData.id.match(/^[a-zA-Z0-9]{6,20}$/)) {
            errors.id = '사용할 수 없는 아이디입니다.';
            isValid = false;
        }

        if (!formData.password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/)) {
            errors.password = '영문, 숫자, 특수기호 포함 8~20자로 작성하여야 합니다.';
            isValid = false;
        }

        if (formData.password !== formData.repassword) {
            errors.repassword = '비밀번호가 일치하지 않습니다.';
            isValid = false;
        }

        if (!formData.name.match(/^[가-힣]+$/)) {
            errors.name = '사용할 수 없는 닉네임입니다.';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();

        if (isValid) {
            try {
                const response = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/SignUp.php', {
                    id: formData.id,
                    password: formData.password,
                    name: formData.name
                });

                if (response.data === true) {
                    alert('회원가입에 성공했습니다.');
                    setShowModal(true);
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

    const closeModal = () => {
        setShowModal(false);
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
                    </Form.Group>
                    <Button className="complete" variant="primary" type="submit">
                        가입완료
                    </Button>
                </Form>
            </div>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>회원가입 완료</Modal.Title>
                </Modal.Header>
                <Modal.Body>회원가입이 완료되었습니다.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={closeModal}>
                        확인
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SignUpForm;
