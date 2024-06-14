import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UpdateInfo.css';

const useFormState = () => {
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
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalImage, setModalImage] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    return {
        formData, setFormData,
        formErrors, setFormErrors,
        isNameDuplicateChecked, setIsNameDuplicateChecked,
        formIsValid, setFormIsValid,
        isLoggedIN, setIsLoggedIN,
        showNewPasswordFields, setShowNewPasswordFields,
        userName, setUserName,
        showModal, setShowModal,
        modalContent, setModalContent,
        modalImage, setModalImage,
        showConfirmModal, setShowConfirmModal
    };
};

const fetchUserInfo = async (setUserName, setFormData, setIsNameDuplicateChecked) => {
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

const handleChange = (e, setFormData, userName, setIsNameDuplicateChecked, validateField) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));

    if (name === 'nickName') {
        if (value === userName) {
            setIsNameDuplicateChecked(true); // 기존 닉네임으로 설정 시 자동 통과
        } else {
            setIsNameDuplicateChecked(false); // 닉네임이 변경되면 중복 확인 필요
        }
    }

    validateField(name, value);
};

const validateField = (fieldName, value, formData, formErrors, setFormErrors, validateForm) => {
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

const validateForm = (formData, setFormIsValid, isNameDuplicateChecked, showNewPasswordFields) => {
    const passwordIsValid = formData.CurPassword.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/);
    const newPasswordIsValid = !showNewPasswordFields || (formData.newPassword === '' || (formData.newPassword.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/) && formData.repassword === formData.newPassword));
    const nickNameIsValid = formData.nickName === '' || (formData.nickName.match(/^(?=.*[a-zA-Z가-힣]).{2,10}$/) && isNameDuplicateChecked);
    
    const isFormValid = passwordIsValid && newPasswordIsValid && nickNameIsValid;
    setFormIsValid(isFormValid);
};

const handleCheckDuplicateNickName = async (formData, userName, setIsNameDuplicateChecked, setShowModal, setModalContent, setModalImage) => {
    if (formData.nickName === userName) {
        setModalContent(`${formData.nickName}은(는) 현재 닉네임으로, 사용 가능합니다.`);
        setModalImage('/img/dream_O.gif');
        setShowModal(true);
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
                setModalContent(`${formData.nickName}은(는) 이미 사용중인 닉네임입니다.`);
                setModalImage('/img/dream_X.gif');
                setShowModal(true);
                setIsNameDuplicateChecked(false);
            } else {
                setModalContent(`${formData.nickName}은(는) 사용 가능한 닉네임입니다.`);
                setModalImage('/img/dream_O.gif');
                setShowModal(true);
                setIsNameDuplicateChecked(true);
            }
        } catch (error) {
            console.error('Error checking duplicate:', error);
            setModalContent('닉네임 중복 확인 중 오류가 발생했습니다.');
            setModalImage('/img/dream_X.gif');
            setShowModal(true);
            setIsNameDuplicateChecked(false);
        }
    } else {
        setModalContent('닉네임의 입력 조건을 확인해주세요.');
        setModalImage('/img/dream_X.gif');
        setShowModal(true);
        setIsNameDuplicateChecked(false);
    }
};

const handleSubmit = async (e, formData, formIsValid, setFormIsValid, navigate, setShowModal, setModalContent, setModalImage) => {
    e.preventDefault();
    validateForm(formData, setFormIsValid, true, true);

    console.log('Form submission status: ', formIsValid);

    if (formIsValid) {
        try {
            const newPasswordToSend = formData.newPassword === '' ? null : formData.newPassword;

            const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/UpdateInfo.php', {
                newName: formData.nickName,
                CurPassword: formData.CurPassword,
                newPassword: newPasswordToSend
            });
            console.log(res.data);

            if (res.data === true) {
                setModalContent('회원정보 수정에 성공했어요!');
                setModalImage('/img/dream_O.gif'); // 수정 성공 시 이미지 변경
                setShowModal(true);
            } else {
                setModalContent('회원정보 수정에 실패했어요!');
                setModalImage('/img/dream_X.gif'); // 수정 실패 시 이미지 변경
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setModalContent('회원정보 수정에 실패했어요!');
            setModalImage('/img/dream_X.gif'); // 수정 실패 시 이미지 변경
            setShowModal(true);
        }
    } else {
        console.log('Form is invalid, cannot submit.');
    }
};

const checkLoginState = async (setIsLoggedIN) => {
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

const handleMemberExit = async (setShowConfirmModal) => {
    setShowConfirmModal(true);
};

const confirmMemberExit = async (navigate, setShowModal, setModalContent, setModalImage) => {
    try {
        await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ExitMember.php');
        setModalContent('회원탈퇴가 완료되었어요. 잘가요!');
        setModalImage('/img/dream_O.gif'); // 탈퇴 성공 시 이미지 변경
        setShowModal(true);
    } catch (err) {
        console.error('탈퇴 실패', err);
        setModalContent('어라, 탈퇴중에 문제가 생겼나봐요.. 탈퇴할 수 없어요!');
        setModalImage('/img/dream_loading_2.gif'); // 탈퇴 실패 시 이미지 변경
        setShowModal(true);
    }
};

const handleCloseModal = (setShowModal, modalContent, navigate) => {
    setShowModal(false);
    if (modalContent === '회원정보 수정에 성공했어요!' || modalContent === '회원탈퇴가 완료되었어요. 잘가요!') {
        navigate('/login'); // 성공 시 로그인 페이지로 이동
    }
};

const UpdateInfoForm = () => {
    const navigate = useNavigate();
    const {
        formData, setFormData,
        formErrors, setFormErrors,
        isNameDuplicateChecked, setIsNameDuplicateChecked,
        formIsValid, setFormIsValid,
        isLoggedIN, setIsLoggedIN,
        showNewPasswordFields, setShowNewPasswordFields,
        userName, setUserName,
        showModal, setShowModal,
        modalContent, setModalContent,
        modalImage, setModalImage,
        showConfirmModal, setShowConfirmModal
    } = useFormState();

    useEffect(() => {
        validateForm(formData, setFormIsValid, isNameDuplicateChecked, showNewPasswordFields);
    }, [formData, isNameDuplicateChecked]);

    useEffect(() => {
        checkLoginState(setIsLoggedIN);
        fetchUserInfo(setUserName, setFormData, setIsNameDuplicateChecked);
    }, []);

    return (
        <div className="background">
            <div className="input">
                <h1 className="mb-4 signUpTitle">회원정보 수정</h1>
                <p className="signUpExplain">비밀번호나 닉네임을 변경할 수 있습니다!</p>
                <Form onSubmit={(e) => handleSubmit(e, formData, formIsValid, setFormIsValid, navigate, setShowModal, setModalContent, setModalImage)} id='formdata'>
                    <Form.Group className="form-group" controlId="formBasicID">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> ID</Form.Label>
                            <Form.Text className="error-message">{formErrors.id}</Form.Text>
                        </div>
                        <Form.Control
                            className="form-control" type="text" name="id" value={formData.id} onChange={(e) => handleChange(e, setFormData, userName, setIsNameDuplicateChecked, (name, value) => validateField(name, value, formData, formErrors, setFormErrors, () => validateForm(formData, setFormIsValid, isNameDuplicateChecked, showNewPasswordFields)))} disabled/>
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formBasicPassword">
                        <div className="labelAlign">
                            <Form.Label className="form-label"><span className='notion'>*</span> 기존 Password</Form.Label>
                            <Form.Text className="error-message">{formErrors.CurPassword}</Form.Text>
                        </div>
                        <Row>
                            <Col xs={8}>
                                <Form.Control className="form-control" type="password" name="CurPassword" placeholder="기존 PW 입력 (8~20자)" value={formData.CurPassword} onChange={(e) => handleChange(e, setFormData, userName, setIsNameDuplicateChecked, (name, value) => validateField(name, value, formData, formErrors, setFormErrors, () => validateForm(formData, setFormIsValid, isNameDuplicateChecked, showNewPasswordFields)))} required />
                            </Col>
                            <Col xs={4}>
                                <Button variant="secondary" onClick={() => setShowNewPasswordFields(!showNewPasswordFields)} className={`mb-3 button-change-pw check-duplicate ${showNewPasswordFields ? 'newPwTrue' : 'newPwFalse'}`}>
                                    비밀번호 바꾸기
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>
                    {showNewPasswordFields && (
                        <>
                            <Form.Group className="form-group" controlId="formBasicNewPassword">
                                <div className="labelAlign">
                                    <Form.Label className={`form-label ${showNewPasswordFields ? 'visible' : ''}`}>새 Password</Form.Label>
                                    <Form.Text className="error-message">{formErrors.newPassword}</Form.Text>
                                </div>
                                <Form.Control className="form-control" type="password" name="newPassword" placeholder="새 PW 입력 (8~20자)" value={formData.newPassword} onChange={(e) => handleChange(e, setFormData, userName, setIsNameDuplicateChecked, (name, value) => validateField(name, value, formData, formErrors, setFormErrors, () => validateForm(formData, setFormIsValid, isNameDuplicateChecked, showNewPasswordFields)))} />
                            </Form.Group>
                            <Form.Group className="form-group" controlId="formBasicReNewPassword">
                                <div className="labelAlign">
                                    <Form.Label className={`form-label ${showNewPasswordFields ? 'visible' : ''}`}>비밀번호 재입력</Form.Label>
                                    <Form.Text className="error-message">{formErrors.repassword}</Form.Text>
                                </div>
                                <Form.Control className="form-control" type="password" name="repassword" placeholder="새 PW 재입력" value={formData.repassword} onChange={(e) => handleChange(e, setFormData, userName, setIsNameDuplicateChecked, (name, value) => validateField(name, value, formData, formErrors, setFormErrors, () => validateForm(formData, setFormIsValid, isNameDuplicateChecked, showNewPasswordFields)))} />
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
                                <Form.Control className="form-control" type="text" name="nickName" value={formData.nickName} onChange={(e) => handleChange(e, setFormData, userName, setIsNameDuplicateChecked, (name, value) => validateField(name, value, formData, formErrors, setFormErrors, () => validateForm(formData, setFormIsValid, isNameDuplicateChecked, showNewPasswordFields)))} />
                            </Col>
                            <Col xs={4}>
                                <Button className={`check-duplicate ${isNameDuplicateChecked ? 'button-change' : ''}`} variant="secondary" onClick={() => handleCheckDuplicateNickName(formData, userName, setIsNameDuplicateChecked, setShowModal, setModalContent, setModalImage)}><b>닉네임 중복 확인</b></Button>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Button className="complete" variant="primary" type="submit" disabled={!formIsValid}>수정완료 </Button>
                </Form>
                <button className="button-exit" onClick={() => handleMemberExit(setShowConfirmModal)}>서비스 탈퇴하기</button>
            </div>
            <Modal className="modal" show={showModal} onHide={() => handleCloseModal(setShowModal, modalContent, navigate)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center modalBody'>
                    <p>{modalContent}</p>
                    {modalImage && <img className="dreams" src={modalImage} alt="Result" style={{ width: '100px' }} />}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="modalClose" variant="secondary" onClick={() => handleCloseModal(setShowModal, modalContent, navigate)}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal className="modal" show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body className='text-center modalBody'>
                    <p>정말 탈퇴하실거에요?</p>
                    <img className="dreams" src="/img/dream_X.gif" alt="Confirm Exit" style={{ width: '100px' }} />
                    <p>같이 갓생살기로 약속했잖아요! 속상해!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="modalClose" variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        취소
                    </Button>
                    <Button className="doCalculate" variant="primary" onClick={() => confirmMemberExit(navigate, setShowModal, setModalContent, setModalImage)}>
                        탈퇴하기
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UpdateInfoForm;
