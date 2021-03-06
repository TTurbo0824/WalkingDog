import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editInfo } from '../../../redux/action';
import styled from 'styled-components';
import axios from 'axios';
import { Colors } from '../../../components/utils/_var';
import { media } from '../../../components/utils/_media-queries';
import { Alertbox, InputField } from '../../../components/UserComponents';
import TopNavigation from '../../../components/TopNavigation';
import UserProfile from './UserProfile';
import default_profile from '../../../images/default_profile.png';
import { ProfileImage } from '../../../components/MyPageComponents';

export const MyinfoWrapper = styled.div`
  .main {
    display: flex;
    min-height: calc(100vh - 15rem);
  }
  .profile-edit {
    cursor: pointer;
    font-size: .85rem;
    color: ${Colors.darkGray};
    width: fit-content;
    margin: .25rem auto 1.5rem;
    text-decoration: underline;
  }
`;

export const MyinfoView = styled.div`
  margin: 1.2rem auto;
  padding-top: 0.7rem;
  box-sizing: border-box;
  width: 19rem;
  height: 28rem;
  background-color: white;
  position: relative;
  text-align: center;
  margin-bottom: 0rem;
  ${media.tablet`margin-bottom: 2.5rem;`}
  input:disabled {
    background: ${Colors.lightGray};
    color: ${Colors.gray};
  }
`;

export const MyinfoInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MyinfoButton = styled.button`
  cursor: pointer;
  width: 5.8rem;
  margin: 0.3rem 0.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 7px;
  border: 2px solid ${(props) => props.color};
  background-color: ${(props) => props.color};
  font-size: 0.85rem;
  color: white;
  :hover {
    background-color: ${Colors.yellow};
    border-color: ${Colors.yellow};
  }
  &:last-of-type {
    border: 2px solid ${Colors.gray};
    background-color: ${Colors.gray};
    color: white;
  }
  &:last-of-type:hover {
    background-color: white;
    border-color: ${Colors.black};
    background-color: ${Colors.black};
  }
`;

function Myinfo ({ modal, handleMessage, handleNotice }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user).token;
  const userInfo = useSelector((state) => state.user).walkingDogUserInfo;
  const { email, nickname, profile_url } = userInfo;
  const kakaoUser = !email.includes('@');
  const isGuest = nickname.includes('guest#');
  const [checkNickname, setCheckNickname] = useState('ok');
  const [checkPassword, setCheckPassword] = useState('ok');
  const [checkRetypePassword, setCheckRetypePassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [openProfile, setOpenProfile] = useState(false);

  const [myInfo, setMyInfo] = useState({
    nickname: '',
    password: ''
  });

  const handleInputValue = (key) => (e) => {
    setMyInfo({ ...myInfo, [key]: e.target.value || '' });
  };

  const isValidNickname = (e) => {
    const regExpSpec = /[~!@#$%^&*()_+|<>?:{}`,.=]/;
    const regExpKor = /[???-???|???-???]/;
    if (e.target.value.length === 0) {
      if (checkRetypePassword) {
        setCheckNickname('ok');
        setErrorMsg('');
      } else {
        setCheckNickname('???????????? ??????????????????');
      }
    } else if (regExpKor.test(e.target.value)) {
      setCheckNickname('????????? ?????? ????????? ???????????????');
    } else if (regExpSpec.test(e.target.value)) {
      setCheckNickname('???????????? ??????????????? ???????????? ????????????');
    } else if (e.target.value.search(/\s/) !== -1) {
      setCheckNickname('???????????? ????????? ???????????? ????????????');
    } else if (e.target.value.length < 3 || e.target.value.length > 8) {
      setCheckNickname('???????????? 3-8????????????');
    } else {
      setCheckNickname('ok');
      if (myInfo.password === '' && myInfo.passwordRetype === '') {
        setCheckPassword('ok');
        setCheckRetypePassword(true);
      }
    }
  };

  const isValidPassword = (e) => {
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,12}$/;

    if (e.target.value === '') {
      if (myInfo.passwordRetype === '' && checkNickname !== 'ok') {
        setCheckPassword('empty');
        setCheckRetypePassword(true);
      } else if (myInfo.passwordRetype === '' && checkNickname === 'ok') {
        setCheckPassword('ok');
        setCheckRetypePassword(true);
        setErrorMsg('');
      } else {
        setCheckPassword('empty');
        setCheckRetypePassword(false);
      }
    } else if (e.target.value !== '') {
      if (myInfo.passwordRetype === e.target.value) {
        setCheckRetypePassword(true);
      } else if (myInfo.passwordRetype !== '' && myInfo.passwordRetype !== e.target.value) {
        setCheckRetypePassword(false);
      }
      if (!regExp.test(e.target.value)) {
        if (e.target.value.length < 8 || e.target.value.length > 12) {
          setCheckPassword('length');
        } else {
          setCheckPassword('no');
        }
      } else {
        setCheckPassword('ok');
      }
    } else {
      setCheckPassword('no');
    }
  };

  const handleCheckPassword = (e) => {
    if (e.target.value !== '' && e.target.value === myInfo.password) {
      setCheckRetypePassword(true);
      // ??????????????? ???????????? ??????????????? ???????????? ????????? ????????????
      if (checkNickname === '???????????? ??????????????????') {
        setCheckNickname('ok');
      }
    } else if (e.target.value === '' && myInfo.password === '') {
      setCheckRetypePassword(true);
    } else if (e.target.value === myInfo.password) {
      setCheckRetypePassword(true);
    } else {
      setCheckRetypePassword(false);
    }
  };

  const inputCheck = (key) => (e) => {
    handleInputValue(key)(e);
    setErrorMsg('');
    if (key === 'nickname') {
      isValidNickname(e);
    }
    if (key === 'password') {
      isValidPassword(e);
    }
    if (key === 'passwordRetype') {
      handleCheckPassword(e);
    }
  };

  const handleEditRequest = () => {
    if (isGuest) {
      setErrorMsg('???????????? ????????? ????????? ??? ????????????');
    } else if (checkPassword === 'length') {
      setErrorMsg('??????????????? 8-12????????????');
    } else if (checkPassword === 'no') {
      setErrorMsg('????????? ??????????????? ????????????');
    } else if (!checkRetypePassword) {
      setErrorMsg('??????????????? ???????????? ????????????');
    } else if (myInfo.nickname === '' && myInfo.password === '') {
      setErrorMsg('????????? ????????? ??????????????????');
    } else if (checkNickname !== 'ok') {
      setErrorMsg(checkNickname);
    } else if (checkPassword !== 'ok' || checkNickname !== 'ok') {
      setErrorMsg('????????? ????????? ???????????? ??????????????????');
    } else {
      if (myInfo.nickname === '') setMyInfo({ ...myInfo, nickname: userInfo.nickname });
      setErrorMsg('');

      axios
        .patch(process.env.REACT_APP_API_URL + '/user-info', myInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          if (res.status === 200) {
            handleNotice(true);
            handleMessage('??????????????? ?????????????????????.');
            if (myInfo.nickname === '') {
              myInfo.nickname = nickname;
            }

            if (myInfo.password === '') {
              myInfo.password = '';
            }
            dispatch(editInfo(myInfo.nickname));
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            modal();
          } else if (error.response.status === 409) {
            setErrorMsg('???????????? ??????????????????.');
          } else {
            handleNotice(true);
            handleMessage('????????? ?????????????????????.');
          }
        });
    }
  };

  const handleWithdrawalRequest = () => {
    if (isGuest) setErrorMsg('???????????? ????????? ????????? ??? ????????????');
    else {
      axios
        .get(process.env.REACT_APP_API_URL + '/user-info', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(() => {
          handleNotice(true);
          kakaoUser
            ? handleMessage('?????? ?????????????????????????!k')
            : handleMessage('?????? ?????????????????????????!g');
        })
        .catch((error) => {
          if (error.response.status === 401) {
            modal();
          } else {
            handleNotice(true);
            handleMessage('????????? ?????????????????????.');
          }
        });
    }
  };

  const handleProfileOpen = () => {
    if (isGuest) {
      handleNotice(true);
      handleMessage(`???????????? ????????? ????????? ???${'\n'}?????? ???????????????.`);
    } else {
      setOpenProfile(true);
    }
  };

  const handleProfileClose = () => {
    setOpenProfile(false);
  };

  return (
    <MyinfoWrapper>
      <TopNavigation />
      <div className='main'>
        <MyinfoView>
          <ProfileImage>
            <img className='review-profile' alt='profile-img' src={profile_url && !isGuest ? profile_url : default_profile} />
          </ProfileImage>
          <div className='profile-edit' onClick={handleProfileOpen}>????????? ?????? ??????</div>
          {openProfile
            ? <UserProfile
                handleProfileClose={handleProfileClose}
                profile_url={profile_url}
                token={token}
                handleMessage={handleMessage}
                handleNotice={handleNotice}
                modal={modal}
              />
            : null}
          <MyinfoInputContainer>
            <InputField
              disabled={isGuest ? 'disabled' : null}
              onChange={inputCheck('nickname')}
              placeholder={nickname}
            />
            <InputField disabled placeholder={email} />
            <InputField
              disabled={isGuest ? 'disabled' : null}
              type='password'
              placeholder='???????????? (??????, ?????? ?????? 8-12???)'
              onChange={inputCheck('password')}
            />
            <InputField
              disabled={isGuest ? 'disabled' : null}
              type='password'
              placeholder='???????????? ?????????'
              onChange={handleCheckPassword}
            />
          </MyinfoInputContainer>
          <MyinfoButton onClick={handleEditRequest} color={Colors.lightYellow}>
            ????????????
          </MyinfoButton>
          <MyinfoButton onClick={handleWithdrawalRequest} color={Colors.darkGray}>
            ????????????
          </MyinfoButton>
          <Alertbox>{errorMsg}</Alertbox>
        </MyinfoView>
      </div>
    </MyinfoWrapper>
  );
}

export default Myinfo;
