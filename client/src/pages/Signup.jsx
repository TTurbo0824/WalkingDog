import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import logo from '../images/logo_text.png';
import { Colors } from '../components/utils/_var';
import { media } from '../components/utils/_media-queries';
import { Logo, Alertbox, Backdrop } from '../components/UserComponents';
import CloseButton from '../components/CloseButton';

const SignupView = styled.div`
  box-sizing: border-box;
  width: 19rem;
  height: 25.5rem;
  ${media.tabletMini`width: 20rem; height: 26rem;`}
  ${media.tablet`width: 21rem; height: 27rem;`}
  background-color: white;
  position: relative;
  text-align: center;
  padding-top: .5rem;
  box-shadow: 8px 8px grey;
  ${media.tablet`box-shadow: 10px 10px grey;`}
  .logo {
    width: 6.75rem;
    margin: .85rem auto .5rem;
    ${media.tabletMini`width: 7rem; margin: .9rem auto .5rem;`}
    ${media.tablet`width: 7.25rem; margin: 1rem auto .8rem;`}
  }
  .veri {
    cursor: pointer;
    font-size: .75rem;
    margin-top: -.2rem;
    margin-bottom: .5rem;
    text-decoration: underline;
    color: ${Colors.darkGray};
    :hover {
      color: ${Colors.black};
    }
  }
`;

const SignUpInputField = styled.input`
  background-color: #f2f2f2;
  border: none;
  border-radius: 15px;
  padding: .5rem 1rem;
  margin-bottom: .5rem;
  color: ${Colors.darkGray};
  width: 14rem;
  height: 1.75rem;
  ${media.tabletMini`width: 14.2rem;`}
  ${media.tablet`width: 15rem; height: 1.9rem;`}
  :focus {
    outline: none;
  }
  ::-webkit-input-placeholder {
    color: ${Colors.gray};
    font-size: .8rem;
  }
`;

const SignUpInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SignUpButton = styled.button`
  margin: .2rem .4rem 0rem;
  cursor: pointer;
  background-color: ${Colors.lightYellow};
  font-size: .85rem;
  width: 14rem;
  height: 2.4rem;
  border-radius: 7px;
  border: none;
  color: white;
  ${media.tabletMini`width: 14.2rem;`}
  ${media.tablet`width: 15rem; height: 2.5rem; font-size: .9rem;`}
  :hover {
    background-color: ${Colors.yellow};
  }
`;

const IsUser = styled.div`
  margin-top: .3rem;
  color: ${Colors.darkGray};
  font-size: .83rem;
  ${media.tablet`font-size: .85rem;`}
  .login {
    cursor: pointer;
    color: ${Colors.yellow};
    :hover {
      color: ${Colors.darkYellow};
    }
  }
`;

function Signup ({ login, handleModal, handleMessage, handleNotice }) {
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    email: '',
    password: '',
    verified: false
  });

  const [checkNickname, setCheckNickname] = useState('');
  const [checkEmail, setCheckEmail] = useState(true);
  const [checkPassword, setCheckPassword] = useState('');
  const [checkRetypePassword, setCheckRetypePassword] = useState(false);
  const [veriCode, setVeriCode] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputValue = (key) => (e) => {
    setUserInfo({ ...userInfo, [key]: e.target.value });
  };

  const isValidNickname = (e) => {
    const regExpSpec = /[~!@#$%^&*()_+|<>?:{}`,.=]/;
    const regExpKor = /[???-???|???-???]/;

    if (e.target.value.includes('guest#')) {
      setCheckNickname('guest');
    } else if (regExpKor.test(e.target.value)) {
      setCheckNickname('korean');
    } else if (regExpSpec.test(e.target.value)) {
      setCheckNickname('special');
    } else if (e.target.value.search(/\s/) !== -1) {
      setCheckNickname('space');
    } else if (e.target.value.length < 3 || e.target.value.length > 8) {
      setCheckNickname('length');
    } else {
      setCheckNickname('ok');
    }
  };

  const isValidEmail = (e) => {
    const regExp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (regExp.test(e.target.value)) {
      setCheckEmail(true);
    } else {
      setCheckEmail(false);
    }
  };

  const isValidPassword = (e) => {
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,12}$/;
    if (e.target.value.length < 8 || e.target.value.length > 12) {
      setCheckPassword('length');
    } else if (regExp.test(e.target.value)) {
      setCheckPassword('ok');
    } else {
      setCheckPassword('fail');
    }
  };

  const handleCheckPassword = (e) => {
    if (e.target.value !== '' && e.target.value === userInfo.password) {
      setCheckRetypePassword(true);
    } else {
      setCheckRetypePassword(false);
    }
  };

  const handleCheckVeriCode = (e) => {
    if (Number(e.target.value) === veriCode) {
      setUserInfo({ ...userInfo, verified: true });
    } else {
      setUserInfo({ ...userInfo, verified: false });
    }
  };

  const inputCheck = (key) => (e) => {
    handleInputValue(key)(e);
    if (key === 'nickname') {
      isValidNickname(e);
    }
    if (key === 'email') {
      isValidEmail(e);
    }
    if (key === 'password') {
      isValidPassword(e);
    }
  };

  const handleSignupRequest = () => {
    if (userInfo.id === '' || userInfo.email === '' || userInfo.password === '') {
      setErrorMsg('?????? ????????? ????????? ?????????');
    } else if (checkNickname === 'guest') {
      setErrorMsg('?????? ???????????? ???????????? ??? ????????????');
    } else if (checkNickname === 'space') {
      setErrorMsg('???????????? ????????? ???????????? ????????????');
    } else if (checkNickname === 'korean') {
      setErrorMsg('????????? ?????? ????????? ???????????????');
    } else if (checkNickname === 'special') {
      setErrorMsg('???????????? ??????????????? ???????????? ????????????');
    } else if (checkNickname === 'length') {
      setErrorMsg('???????????? 3-8????????????');
    } else if (!checkEmail) {
      setErrorMsg('????????? ????????? ??????????????????');
    } else if (checkPassword === 'length') {
      setErrorMsg('??????????????? 8-12????????????');
    } else if (checkPassword !== 'ok') {
      setErrorMsg('???????????? ????????? ??????????????????');
    } else if (checkRetypePassword !== true) {
      setErrorMsg('??????????????? ???????????? ????????????');
    } else if (!userInfo.verified) {
      setErrorMsg('???????????? ????????? ??????????????? ??????????????????.');
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/signup`, userInfo, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
        .then((res) => {
          if (res.status === 201) {
            handleModal();
            handleNotice(true);
            handleMessage('???????????? ??????!');
          }
        })
        .catch((error) => {
          if (error.response.data.message === 'conflict: email & nickname') {
            setErrorMsg('?????? ????????? ???????????? ??????????????????');
          } else if (error.response.data.message === 'conflict: email') {
            setErrorMsg('?????? ????????? ??????????????????');
          } else if (error.response.data.message === 'conflict: nickname') {
            setErrorMsg('?????? ????????? ??????????????????');
          } else {
            handleModal();
            handleNotice(true);
            handleMessage('????????? ?????????????????????.');
          }
        });
    }
  };

  const sendEmail = () => {
    if (!checkEmail || !userInfo.email) {
      setErrorMsg('????????? ????????? ????????? ??????????????????');
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/auth`, { email: userInfo.email }, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
        .then((res) => {
          if (res.status === 200) {
            setVeriCode(res.data.data);
            setErrorMsg('?????? ???????????? ?????????????????????');
          }
        })
        .catch((error) => {
          handleModal();
          handleNotice(true);
          handleMessage('????????? ?????????????????????.');
        });
    }
  };

  const goLogin = () => {
    handleModal();
    login();
  };

  return (
    <Backdrop>
      <SignupView>
        <CloseButton onClick={handleModal} />
        <Logo src={logo} alt='logo' />
        <SignUpInputContainer>
          <SignUpInputField onChange={inputCheck('nickname')} placeholder='????????? (3-8???)' />
          <SignUpInputField onChange={inputCheck('email')} placeholder='?????????' />
          <div className='veri' onClick={sendEmail}>????????? ??????</div>
          <SignUpInputField onChange={handleCheckVeriCode} placeholder='???????????? ??????' />
          <SignUpInputField type='password' onChange={inputCheck('password')} placeholder='???????????? (??????, ?????? ?????? 8-12???)' />
          <SignUpInputField
            type='password'
            onChange={handleCheckPassword}
            placeholder='???????????? ?????????'
          />
        </SignUpInputContainer>
        <SignUpButton onClick={handleSignupRequest}>????????????</SignUpButton>
        <IsUser>?????? ??????????????????? <span className='login' onClick={goLogin}>????????? ??????</span></IsUser>
        <Alertbox>{errorMsg}</Alertbox>
      </SignupView>
    </Backdrop>
  );
}

export default Signup;
