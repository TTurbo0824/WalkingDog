import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../redux/action';
import axios from 'axios';
import { Colors } from '../components/utils/_var';
import logo from '../images/logo.png';

const HeaderWrapper = styled.div`
  .header {
    display: grid;
    height: 3.5rem;
    width: 100vw;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgba(150, 150, 150, 0.2);
    grid-template-areas: 'logo pages';
    grid-template-columns: 50% 50%;
  }
  .header-container-1 {
    grid-area: logo;
    text-align: left;
    padding-left: 1rem;
    max-width: 8rem;
  }
  .header-container-2 {
    grid-area: pages;
    justify-self: end;
    padding-right: 1rem;
    margin-top: 0rem;
  }
  .logo-image {
    padding-top: 0.1rem;
    width: 5.75rem;
  }
`;

export const HeaderButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-family: 'Noto Sans KR', sans-serif;
  padding-left: 0.5rem;
  color: ${Colors.gray};

  &:hover {
    color: ${Colors.yellow};
  }
  &:focus {
    outline: none;
  }
`;

function Header ({ login, signup, modal, handleMessage, handleNotice }) {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user).token;

  console.log(isLogin);
  const isExpired = useSelector((state) => state.user).userInfo[0].isExpired;

  const handleLogoutRequest = () => {
    const token = isLogin;

    if (isExpired) {
      modal();
    } else {
      // JUST FOR TESTING PURPOSES
      dispatch(userLogout());
      localStorage.clear();
      handleNotice(true);
      handleMessage('로그아웃 성공!');

      /*
      axios
        .post(process.env.REACT_APP_API_URL + '/logout', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        .then(() => {
          dispatch(userLogout());
          localStorage.clear();
          handleNotice(true);
          handleMessage('로그아웃 성공!');
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
      */
    }
  };

  return (
    <HeaderWrapper>
      <div className='header'>
        <div className='header-container-1'>
          <Link to='/'>
            <img src={logo} className='logo-image' alt='logo_img' />
          </Link>
        </div>
        <div className='header-container-2'>
          {!isLogin
            ? (
              <HeaderButton onClick={login}>로그인</HeaderButton>
              )
            : (
              <HeaderButton onClick={handleLogoutRequest}>로그아웃</HeaderButton>
              )}
          {!isLogin
            ? (
              <HeaderButton onClick={signup}>회원가입</HeaderButton>
              )
            : (
              <Link to='/mypage'>
                <HeaderButton>마이페이지</HeaderButton>
              </Link>
              )}
        </div>
      </div>
    </HeaderWrapper>
  );
}

export default Header;
