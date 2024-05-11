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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        // 아이디 유효성 검사
        if (!formData.id.match(/^[a-zA-Z0-9]{6,20}$/)) {
            errors.id = '6~20자의 영문자, 숫자로 입력해주세요.';
            isValid = false;
        }

        // 비밀번호 유효성 검사
        if (!formData.password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/)) {
            errors.password = '8~20자로 영문자, 숫자, 특수문자를 포함하여 입력해주세요.';
            isValid = false;
        }
  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 정보 저장
    let formData = document.getElementById('formdata');
    let formdata = new FormData(formData);
    axios.post('http://localhost:3001/PHP/SignUp.php',{
      id: formdata.get('id'),
      password: formdata.get('password'),
      name: formdata.get('nickname')
    })
    .then((res)=>{
      console.log(res)
      if (res.data == true) {
        alert('회원가입에 성공했습니다.')
        setShowModal(true);
      } else {
        alert('회원가입에 실패했습니다.')
      }
    })
    // 회원가입 완료 시 모달 열기
  };
        // 비밀번호 확인 유효성 검사
        if (formData.password !== formData.repassword) {
            errors.repassword = '비밀번호가 일치하지 않습니다. 비밀번호를 다시 입력해주세요.';
            isValid = false;
        }
        // 이름 유효성 검사
        if (!formData.name.match(/^[가-힣]+$/)) {
            errors.name = '한글로 입력해주세요.';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };
  return (
    <div className="background">
      <div className="input">
        <h1 className="mb-4">회원가입</h1>
        <p>회원이 되어 다양한 혜택을 누려보세요!</p>
        <Form onSubmit={handleSubmit} id='formdata'>
          <Form.Group controlId="formBasicId">
            <Form.Label>ID</Form.Label> <Form.Text>{idValidation}</Form.Text>
            <Row>
              <Col>
                <Form.Control type="text" name="id" value={formData.id} onChange={handleChange} required />
              </Col>
              <Col>
                <Button variant="secondary" onClick={handleCheckDuplicate}>중복확인</Button>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label> {passwordValidation && <Form.Text>{passwordValidation}</Form.Text>}
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} onBlur={handlePasswordBlur} required />
          </Form.Group>
          <Form.Group controlId="formBasicConfirmPassword">
            <Form.Label>Password 확인</Form.Label> {confirmPasswordValidation && <Form.Text>{confirmPasswordValidation}</Form.Text>}
            <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleConfirmPasswordChange} onBlur={handlePasswordBlur} required />
          </Form.Group>
          <Form.Group controlId="formBasicNickname">
            <Form.Label>닉네임</Form.Label> <Form.Text>{nicknameValidation}</Form.Text>
            <Form.Control type="text" name="nickname" value={formData.nickname} onChange={handleChange} onBlur={handleNicknameBlur} required />
          </Form.Group>
          <Button variant="primary" type="submit">
            가입하기
          </Button>
        </Form>
      </div>
      {/* 모달 */}
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();

        if (isValid) {
            try {
                const response = await axios.post('', {
                    id: formData.id,
                    password: formData.password,
                    name: formData.name
                });

                if (response.data.success) {
                    alert('회원가입에 성공했습니다.');
                    // 원하는 경로로 이동
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
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="id">아이디</label>
                <input type="text" id="id" name="id" value={formData.id} onChange={handleChange} />
                {formErrors.id && <div style={{ color: 'red' }}>{formErrors.id}</div>}
            </div>

            <div>
                <label htmlFor="password">비밀번호</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                {formErrors.password && <div style={{ color: 'red' }}>{formErrors.password}</div>}
            </div>

            <div>
                <label htmlFor="repassword">비밀번호 확인</label>
                <input type="password" id="repassword" name="repassword" value={formData.repassword} onChange={handleChange} />
                {formErrors.repassword && <div style={{ color: 'red' }}>{formErrors.repassword}</div>}
            </div>

            <div>
                <label htmlFor="name">이름</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                {formErrors.name && <div style={{ color: 'red' }}>{formErrors.name}</div>}
            </div>

            <button type="submit">회원가입</button>
        </form>
    );
};

export default SignUpForm;
