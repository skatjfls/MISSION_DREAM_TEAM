import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가

const SignUpPage = () => {
  const initialIds = ['skatjfls', 'dlwlals', 'rhkrwotjq', 'rlagustn', 'dksgyfls'];
  const initialNicknames = ['남서린', '이지민', '곽재섭', '김현수', '안효린'];
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });
  const [idList, setIdList] = useState(initialIds);
  const [nicknameList, setNicknameList] = useState(initialNicknames);
  const [idValidation, setIdValidation] = useState('');
  const [passwordValidation, setPasswordValidation] = useState('');
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState('');
  const [nicknameValidation, setNicknameValidation] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckDuplicate = () => {
    if (!/^[a-zA-Z0-9]{6,20}$/.test(formData.id)) {
      setIdValidation('아이디는 영문자와 숫자 조합으로 6자 이상 20자 이하여야 합니다.');
    } else if (idList.includes(formData.id)) {
      setIdValidation('사용할 수 없는 아이디입니다.');
    } else {
      setIdValidation('사용가능한 아이디입니다.');
    }
  };

  const handlePasswordBlur = () => {
    if (!/(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/.test(formData.password)) {
      setPasswordValidation('영문, 숫자, 특수기호 포함 8~20자로 작성하여야 합니다.');
    } else {
      setPasswordValidation('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      confirmPassword: value
    }));
    if (value !== formData.password) {
      setConfirmPasswordValidation('비밀번호가 일치하지 않습니다.');
    } else{
      setConfirmPasswordValidation('');
    }
  };

  const handleNicknameBlur = () => {
    if (nicknameList.includes(formData.nickname)) {
      setNicknameValidation('사용할 수 없는 닉네임입니다.');
    } else {
      setNicknameValidation('사용가능한 닉네임입니다.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 완료 시 모달 열기
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // 모달이 닫힐 때 상위폴더인 App.js로 이동
    navigate('/');
  };

  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <div className="p-5 border rounded-lg">
        <h1 className="mb-4">회원가입</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicId">
            <Form.Label>ID</Form.Label>
            <Row>
              <Col>
                <Form.Control type="text" name="id" value={formData.id} onChange={handleChange} required />
              </Col>
              <Col>
                <Button variant="secondary" onClick={handleCheckDuplicate}>중복확인</Button>
              </Col>
            </Row>
            <Form.Text>{idValidation}</Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} onBlur={handlePasswordBlur} required />
            {passwordValidation && <Form.Text>{passwordValidation}</Form.Text>}
          </Form.Group>
          <Form.Group controlId="formBasicConfirmPassword">
            <Form.Label>Password 확인</Form.Label>
            <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleConfirmPasswordChange} onBlur={handlePasswordBlur} required />
            {confirmPasswordValidation && <Form.Text>{confirmPasswordValidation}</Form.Text>}
          </Form.Group>
          <Form.Group controlId="formBasicNickname">
            <Form.Label>닉네임</Form.Label>
            <Form.Control type="text" name="nickname" value={formData.nickname} onChange={handleChange} onBlur={handleNicknameBlur} required />
            <Form.Text>{nicknameValidation}</Form.Text>
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
    </Container>
  );
};

export default SignUpPage;
