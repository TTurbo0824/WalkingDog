import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import TopNavigation from '../../../components/TopNavigation';
import { Colors } from '../../../components/utils/_var';
import { media } from '../../../components/utils/_media-queries';
import { MyPageTable } from '../../../components/MyPageComponents';
axios.defaults.withCredentials = true;

const moment = require('moment');

export const MyRequestWrapper = styled.div`
  .main {
    display: flex;
    min-height: calc(100vh - 15rem);
    ${media.tablet`min-height: calc(100vh - 21.4rem);`}
  }
  .total {
    font-size: 1.1rem;
    margin-bottom: .5rem;
  }
  .container {
    margin: 1rem auto;
  }
  .field-container {
    display: grid;
    padding-bottom: .1rem;
    border-bottom: 1px solid ${Colors.lightGray};
    grid-template-areas:
      'alls expired select';
    grid-template-columns: 1fr 1fr 5.3rem;
    width: 87vw;
    ${media.tabletMini`width: 92vw; max-width: 40rem;`}
    ${media.tablet`width: 40rem; grid-template-columns: 1fr 1fr 5.6rem;`}
  }
  .separator {
    margin-left: .6rem;
    ${media.tablet`margin-left: .64rem;`}
    font-size: .65rem;
    line-height: 1.15rem;
    color: ${Colors.mediumLightGray};
  }
  .expired {
    grid-area: expired;
  }
  .card {
    grid-template-areas:
      'check img title title title'
      'check img info info info'
      'check img type type type'
      'check status status cancel cancel';
    ${media.tabletMini`grid-template-areas:
      'check img title status cancel'
      'check img info status cancel'
      'check img type status cancel';`}
  }
  .status {
    grid-area: status;
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: center;
    font-size: .82rem;
    ${media.tabletMini`font-size: .85rem;`}
  }
  .res-bottom {
    display: normal;
    width: 20rem;
    white-space: nowrap;
  }
  .cancel {
    grid-area: cancel;
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: center;
  }
  .status, .cancel {
    margin-top: .5rem;
    ${media.tabletMini`margin-top: 0;`}
  }
`;

function MyRequest ({ handleMessage, handleNotice }) {
  const dogWalkerList = useSelector((state) => state.dogwalker).dogWalkers;
  const allRequest = useSelector((state) => state.request).dogWalkerRequest;
  const [IdList, setIdList] = useState([]);
  const [CheckList, setCheckList] = useState([]);

  const isExpired = (date, time) => {
    const now = new Date();
    const target = moment(now);
    let requestTime = 0;

    if (time === '?????? 12???') {
      requestTime = 0;
    } else if (time === '?????? 12???') {
      requestTime = 12;
    } else if (time[1] === '???') {
      requestTime = Number(time.split(' ')[1].slice(0, -1)) + 12;
    } else {
      requestTime = Number(time.split(' ')[1].slice(0, -1));
    }

    const dateTime = `${date} ${requestTime}`;
    const requestDate = moment(dateTime, 'YYYY.MM.DD H');

    return requestDate.from(target).includes('ago') ? '?????? ??????' : '?????? ?????? ???';
  };

  useEffect(() => {
    const ids = [];
    if (allRequest.length !== 0) {
      allRequest.forEach((request, i) => {
        ids[i] = request.id;
      });
      setIdList(ids);
    }
  }, [allRequest]);

  const onChangeAll = (e) => {
    // ????????? ??? CheckList??? id ??? ?????? ??????, ?????? ????????? ??? CheckList??? ??? ?????? ??????
    setCheckList(e.target.checked ? IdList : []);
  };

  const onChangeEach = (e, id) => {
    // ????????? ??? CheckList??? id??? ??????
    if (e.target.checked) {
      setCheckList([...CheckList, id]);
      // ?????? ????????? ??? CheckList?????? ?????? id?????? ?????? ?????? ????????? ??????
    } else {
      setCheckList(CheckList.filter((checkedId) => checkedId !== id));
    }
  };

  const walkerList = [];

  dogWalkerList.map((el) => (
    walkerList.push(el.name)
  ));

  const deleteClick = (id) => {
    if (allRequest.length === 0) {
      handleNotice(true);
      handleMessage('????????? ????????? ????????????.');
    } else {
      handleNotice(true);
      handleMessage(`?????? ????????? ?????????????????????????!#${id}`);
      setCheckList([]);
    }
  };

  const deleteSelected = (id) => {
    if (allRequest.length === 0) {
      handleNotice(true);
      handleMessage('????????? ????????? ????????????.');
    } else if (CheckList.length === 0) {
      handleNotice(true);
      handleMessage('????????? ????????? ??????????????????.');
    } else {
      handleNotice(true);
      handleMessage(`?????? ????????? ?????????????????????????!#${id}`);
      setCheckList([]);
    }
  };

  const handleClick = (id) => {
    window.location.replace(`/dogwalker:id=${id}`);
  };

  const addComma = (num) => {
    num = String(num).split('');
    num.splice(-3, 0, ',');
    num = num.join('');
    return num;
  };

  const handleExpiredDelete = () => {
    if (allRequest.length === 0) {
      handleNotice(true);
      handleMessage('????????? ????????? ????????????.');
    } else {
      const expiredRequest = [];

      allRequest.forEach((el) => {
        if (isExpired(el.date, el.time) === '?????? ??????') {
          expiredRequest.push(el.id);
        }
      });

      if (expiredRequest.length === 0) {
        handleNotice(true);
        handleMessage('????????? ????????? ????????????.');
      } else {
        handleNotice(true);
        handleMessage(`????????? ????????? ?????????????????????????!#${expiredRequest}`);
      }
    }
  };

  const handleSearchClicked = () => {
    window.location.replace('/search');
  };

  return (
    <MyRequestWrapper>
      <TopNavigation />
      <div className='main'>
        <div className='container'>
          <MyPageTable>
            <div className='field-container'>
              <label className='all'>
                <input
                  type='checkbox'
                  className='select-all'
                  onChange={onChangeAll}
                  checked={CheckList.length !== 0 ? CheckList.length === IdList.length : false}
                  disabled={!allRequest.length ? 'disable' : null}
                />
                <div className='description' style={{ cursor: 'pointer' }}>????????????</div>
              </label>
              <div className='delete-bnt description expired' onClick={handleExpiredDelete}>
                ??????????????????
                <span className='separator'>|</span>
              </div>
              <div className='delete-bnt description select' onClick={() => deleteSelected(CheckList)}>??????????????????</div>
            </div>
            {allRequest.length === 0
              ? <div>
                <div className='no-items'>?????? ????????? ????????????. {'\n'} ??? ?????? ??????????????? ???????????????!</div>
                <button className='search-bnt' onClick={handleSearchClicked}>???????????? ??????</button>
                </div>
              : allRequest.map((el, idx) => {
                return (
                  <div className='card' key={idx}>
                    <input
                      type='checkbox'
                      className='select-one'
                      onChange={(e) => onChangeEach(e, el.id)}
                      checked={CheckList.includes(el.id)}
                    />
                    <img className='dogwalker-img' src={`/images/dog_images/dog_${el.dogwalkerId}.jpeg`} alt={el.name} onClick={() => handleClick(el.dogwalkerId)} />
                    <div className='name'>{el.name}</div>
                    <div className='info'>{el.date} {el.time} {el.location}</div>
                    <div className='type'>{el.type}  <span>|</span> {el.duration}??? / {addComma(el.price)}???</div>
                    <div className='status'>{isExpired(el.date, el.time)}</div>
                    <div className='cancel bnt' onClick={() => deleteClick(el.id)}>?????? ??????</div>
                  </div>
                );
              })}
          </MyPageTable>
        </div>
      </div>
    </MyRequestWrapper>
  );
}

export default MyRequest;
