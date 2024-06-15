import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const useFormState = () => {
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        repassword: '',
        nickName: ''  
    });
    const [formErrors, setFormErrors] = useState({
        id: '',
        password: '',
        repassword: '',
        nickName: ''
    });
    const [isIDDuplicateChecked, setIsIDDuplicateChecked] = useState(false);
    const [isNameDuplicateChecked, setIsNameDuplicateChecked] = useState(false);
    const [formIsValid, setFormIsValid] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalImage, setModalImage] = useState('');

    return {
        formData, setFormData,
        formErrors, setFormErrors,
        isIDDuplicateChecked, setIsIDDuplicateChecked,
        isNameDuplicateChecked, setIsNameDuplicateChecked,
        formIsValid, setFormIsValid,
        showModal, setShowModal,
        modalContent, setModalContent,
        modalImage, setModalImage
    };
};

const SignUpForm = () => {
    const navigate = useNavigate();
    const {
        formData, setFormData,
        formErrors, setFormErrors,
        isIDDuplicateChecked, setIsIDDuplicateChecked,
        isNameDuplicateChecked, setIsNameDuplicateChecked,
        formIsValid, setFormIsValid,
        showModal, setShowModal,
        modalContent, setModalContent,
        modalImage, setModalImage
    } = useFormState();

    useEffect(() => {
        validateForm(formData, setFormIsValid, isIDDuplicateChecked, isNameDuplicateChecked);
    }, [formData, isIDDuplicateChecked, isNameDuplicateChecked]);

    useEffect(() => {
        axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/CheckLoginState.php')
        .then(res => {
        if(res.data === true){
            navigate('/');
        }
        })
        .catch(error => {
        console.error('Error fetching user info:', error)
        })
    }, [])

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                if (modalContent === '회원가입에 성공했어요!! 환영합니다!!') {
                    setShowModal(false);
                    window.removeEventListener('keydown', handleKeyPress); // 엔터키 이벤트 리스너 제거
                    setTimeout(() => navigate('/login'), 0); // 로그인 페이지로 이동
                } else {
                    setShowModal(false);
                }
            }
        };
    
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [setShowModal, modalContent, navigate]);

    return (
        <div className="background">
            <div className="input">
                <h1 className="mb-4 signUpTitle">회원가입</h1>
                <p className="signUpExplain">회원이 되어 다양한 혜택을 누려보세요!</p>
                <Form onSubmit={(e) => handleSubmit(e, formData, setModalContent, setModalImage, setShowModal, isIDDuplicateChecked, isNameDuplicateChecked)} id='formdata'>
                    <Form.Group className="form-group" controlId="formBasicId">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> ID</Form.Label>
                            <Form.Text className="error-message">{formErrors.id}</Form.Text>
                        </div>
                        <Row>
                            <Col xs={8}>
                                <Form.Control className="form-control" type="text" name="id" placeholder="ID 입력 (6~20자)" value={formData.id} onChange={(e) => handleChange(e, setFormData, (name, value) => validateField(name, value, formData, formErrors, setFormErrors, () => validateForm(formData, setFormIsValid, isIDDuplicateChecked, isNameDuplicateChecked)), setIsIDDuplicateChecked, setIsNameDuplicateChecked)} required />
                            </Col>
                            <Col xs={4}>
                                <Button className={`check-duplicate ${isIDDuplicateChecked ? 'button-change' : ''}`} variant="secondary" onClick={() => handleCheckDuplicateID(formData, setModalContent, setShowModal, setIsIDDuplicateChecked, setModalImage)}><b>ID 중복 확인</b></Button>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formBasicPassword">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> Password</Form.Label>
                            <Form.Text className="error-message">{formErrors.password}</Form.Text>
                        </div>
                        <Form.Control className="form-control" type="password" name="password" placeholder="PW 입력 (8~20자)" value={formData.password} onChange={(e) => handleChange(e, setFormData, (name, value) => validateField(name, value, formData, formErrors, setFormErrors, () => validateForm(formData, setFormIsValid, isIDDuplicateChecked, isNameDuplicateChecked)), setIsIDDuplicateChecked, setIsNameDuplicateChecked)} required />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formBasicConfirmPassword">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> Password 확인</Form.Label>
                            <Form.Text className="error-message">{formErrors.repassword}</Form.Text>
                        </div>
                        <Form.Control className="form-control" type="password" name="repassword" placeholder="PW 재입력" value={formData.repassword} onChange={(e) => handleChange(e, setFormData, (name, value) => validateField(name, value, formData, formErrors, setFormErrors, () => validateForm(formData, setFormIsValid, isIDDuplicateChecked, isNameDuplicateChecked)), setIsIDDuplicateChecked, setIsNameDuplicateChecked)} required />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formBasicName">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> 닉네임</Form.Label>
                            <Form.Text className="error-message">{formErrors.nickName}</Form.Text> 
                        </div>
                        <Row>
                            <Col xs={8}>
                                <Form.Control className="form-control" type="text" name="nickName" placeholder="닉네임 입력 (2~10자)" value={formData.nickName} onChange={(e) => handleChange(e, setFormData, (name, value) => validateField(name, value, formData, formErrors, setFormErrors, () => validateForm(formData, setFormIsValid, isIDDuplicateChecked, isNameDuplicateChecked)), setIsIDDuplicateChecked, setIsNameDuplicateChecked)} required />
                            </Col>
                            <Col xs={4}>
                                <Button className={`check-duplicate ${isNameDuplicateChecked ? 'button-change' : ''}`} variant="secondary" onClick={() => handleCheckDuplicateNickName(formData, setModalContent, setShowModal, setIsNameDuplicateChecked, setModalImage)}><b>닉네임 중복 확인</b></Button>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Button className="complete" variant="primary" type="submit" disabled={!formIsValid}>
                        가입완료
                    </Button>
                </Form>
            </div>
            <Modal className="modal" show={showModal} onHide={() => handleCloseModal(modalContent, setShowModal, navigate)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center modalBody'>
                    <p>{modalContent}</p>
                    {modalImage && <img className="dreams" src={modalImage} alt="Result" style={{ width: '100px' }} />}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="modalClose" variant="secondary" onClick={() => handleCloseModal(modalContent, setShowModal, navigate)}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const handleChange = (e, setFormData, validateField, setIsIDDuplicateChecked, setIsNameDuplicateChecked) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    validateField(name, value);

    if (name === 'id') {
        setIsIDDuplicateChecked(false);
    }
    if (name === 'nickName') {
        setIsNameDuplicateChecked(false);
    }
};

const validateField = (fieldName, value, formData, formErrors, setFormErrors, validateForm) => {
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
        case 'nickName': 
            errors.nickName = value.match(/^(?=.*[a-zA-Z가-힣]).{2,10}$/) ? '' : '영문 혹은 한글을 포함하여 2~10자로 작성하여야 합니다.';
            break;
        default:
            break;
    }
    setFormErrors(errors);
    validateForm();
};

const validateForm = (formData, setFormIsValid, isIDDuplicateChecked, isNameDuplicateChecked) => {
    const idIsValid = formData.id.match(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/);
    const passwordIsValid = formData.password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/);
    const nickNameIsValid = formData.nickName.match(/^((?=.*[a-zA-Z가-힣])[a-zA-Z\d가-힣]{2,10})$/);  
    const isValid = idIsValid && passwordIsValid && nickNameIsValid && formData.id !== '' && formData.password !== '' && formData.nickName !== '' && formData.repassword === formData.password && isIDDuplicateChecked && isNameDuplicateChecked;

    setFormIsValid(isValid);
};

const handleCheckDuplicateID = async (formData, setModalContent, setShowModal, setIsIDDuplicateChecked, setModalImage) => {
    const idValidationResult = formData.id.match(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/);
    if (idValidationResult) {
        try {
            const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/IdCheck.php', {
                id: formData.id
            });
            console.log(res.data);
            if (res.data === true) {
                setModalContent(`${formData.id}은(는) 이미 사용중인 아이디입니다.`);
                setModalImage('/img/dream_X.gif'); // 중복 실패 시 이미지 변경
                setShowModal(true);
                setIsIDDuplicateChecked(false);
            } else {
                setModalContent(`${formData.id}은(는) 사용 가능한 아이디입니다.`);
                setModalImage('/img/dream_O.gif'); // 중복 성공 시 이미지 변경
                setShowModal(true);
                setIsIDDuplicateChecked(true);
            }
        } catch (error) {
            console.error('Error checking duplicate:', error);
            alert('아이디 중복 확인 중 오류가 발생했습니다.');
        }
    } else {
        setModalContent(`ID의 입력 조건을 확인해주세요.`);
        setModalImage('/img/dream_X.gif'); // 입력 조건 확인 실패 시 이미지 변경
        setShowModal(true);
        setIsIDDuplicateChecked(false);
    }
};

const handleCheckDuplicateNickName = async (formData, setModalContent, setShowModal, setIsNameDuplicateChecked, setModalImage) => {
    const nameValidationResult = formData.nickName.match(/^(?=.*[a-zA-Z가-힣]).{2,10}$/);
    if (nameValidationResult) {
        try {
            const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/NickNameCheck.php', {
                nickName: formData.nickName 
            });
            console.log(res.data);
            if (res.data === true) {
                setModalContent(`${formData.nickName}은(는) 이미 사용중인 닉네임입니다.`);
                setModalImage('/img/dream_X.gif'); // 중복 실패 시 이미지 변경
                setShowModal(true);
                setIsNameDuplicateChecked(false);
            } else {
                setModalContent(`${formData.nickName}은(는) 사용 가능한 닉네임입니다.`);
                setModalImage('/img/dream_O.gif'); // 중복 성공 시 이미지 변경
                setShowModal(true);
                setIsNameDuplicateChecked(true);
            }
        } catch (error) {
            console.error('Error checking duplicate:', error);
            setModalContent('닉네임 중복 확인 중 오류가 발생했습니다.');
            setModalImage('/img/dream_X.gif'); // 오류 발생 시 이미지 변경
            setShowModal(true);
            setIsNameDuplicateChecked(false);
        }
    } else {
        setModalContent('닉네임의 입력 조건을 확인해주세요.');
        setModalImage('/img/dream_X.gif'); // 입력 조건 확인 실패 시 이미지 변경
        setShowModal(true);
        setIsNameDuplicateChecked(false);
    }
};

const handleCloseModal = (modalContent, setShowModal, navigate) => {
    if (modalContent === '회원가입에 성공했어요!! 환영합니다!!') {
        setShowModal(false);
        navigate('/login'); // 로그인 페이지로 이동
    } else {
        setShowModal(false);
    }
};

const handleSubmit = async (e, formData, setModalContent, setModalImage, setShowModal, isIDDuplicateChecked, isNameDuplicateChecked) => {
    e.preventDefault();
    const idIsValid = formData.id.match(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/);
    const passwordIsValid = formData.password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/);
    const nickNameIsValid = formData.nickName.match(/^([a-zA-Z가-힣]{1,}).{1,9}$/); 
    const isValid = idIsValid && passwordIsValid && nickNameIsValid && formData.id !== '' && formData.password !== '' && formData.nickName !== '' && formData.repassword === formData.password && isIDDuplicateChecked && isNameDuplicateChecked;

    if (isValid) {
        try {
            const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/SignUp.php', {
                id: formData.id,
                password: formData.password,
                name: formData.nickName  
            });
            console.log(res.data);

            if (res.data === true) {
                setModalContent('회원가입에 성공했어요!! 환영합니다!!');
                setModalImage('/img/dream_O.gif'); // 회원가입 성공 시 이미지 변경
                setShowModal(true);
            } else {
                setModalContent('회원가입에 실패했어요...');
                setModalImage('/img/dream_X.gif'); // 회원가입 실패 시 이미지 변경
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        }
    } else {
        console.log('Form is invalid, cannot submit.');
    }
};

export default SignUpForm;
