import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { media } from '../../../components/utils/_media-queries';
import { MyPageTable } from '../../../components/MyPageComponents';
import TopNavigation from '../../../components/TopNavigation';
import Rating from './Rating';
import RatingEdit from './RatingEdit';
import Review from './Review';
import ReviewEdit from './ReviewEdit';
axios.defaults.withCredentials = true;

export const MyHistoryWrapper = styled.div`
  .main {
    display: flex;
    min-height: calc(100vh - 15rem);
    ${media.tablet`min-height: calc(100vh - 21.4rem);`}
  }
  .container {
    margin: 1rem auto;
  }
  .field-container  {
    grid-template-areas:
      'alls select';
    grid-template-columns: 1fr 1fr;
    width: 87vw;
    ${media.tabletMini`width: 92vw; max-width: 40rem;`}
    ${media.tablet`width: 40rem;`}
  }
  .card {
    grid-template-areas:
      'check img title title title'
      'check img info info info'
      'check img type type type'
      'check rating rating review review';
    ${media.tabletMini`grid-template-areas:
      'check img title rating review'
      'check img info rating review'
      'check img type rating review';`}
  }
  .rating {
    grid-area: rating;
    margin-right: .5rem ;
  }
  .review {
    grid-area: review;
    margin-left: .5rem ;
  }
`;

function MyHistory ({ modal, handleMessage, handleNotice }) {
  const token = useSelector((state) => state.user).token;
  const [openRating, setOpenRating] = useState(false);
  const [openRatingEdit, setOpenRatingEdit] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [openReviewEdit, setOpenReviewEdit] = useState(false);
  const [historyInfo, setHistoryInfo] = useState({ historyId: null, historyIndex: null });
  const [serviceDate, setServiceDate] = useState(null);
  const [targetReview, setTargetReview] = useState({
    id: null,
    content: null
  });
  const [targetRating, setTargetRating] = useState({
    id: null,
    rating: null
  });
  const [IdList, setIdList] = useState([]);
  const [CheckList, setCheckList] = useState([]);

  const allHistories = useSelector((state) => state.history).dogWalkerHistory;

  useEffect(() => {
    const ids = [];
    if (allHistories.length !== 0) {
      allHistories.forEach((history, i) => {
        ids[i] = history.id;
      });
      setIdList(ids);
    }
  }, [allHistories]);

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

  const givenRatings = useSelector((state) => state.rating).givenRating;
  const givenReviews = useSelector((state) => state.review).givenReview;
  const givenRatingIds = givenRatings.map((el) => el.id) || [];
  const givenReviewIds = givenReviews.map((el) => el.id) || [];

  const handleRatingOpen = (id) => {
    setHistoryInfo({ ...historyInfo, historyId: id });
    setOpenRating(true);
  };

  const handleRatingClose = () => {
    setOpenRating(false);
  };

  const handleReviewOpen = (id, date) => {
    setHistoryInfo({ ...historyInfo, historyId: id });
    setServiceDate(date);
    setOpenReview(true);
  };

  const handleReviewClose = () => {
    setOpenReview(false);
  };

  const handleReviewEditOpen = (id) => {
    givenReviews.forEach((el) => {
      if (el.id === id) {
        setTargetReview({
          id: el.id,
          content: el.content
        });
      }
    });
    setOpenReviewEdit(true);
  };

  const handleRatingEditOpen = (id) => {
    givenRatings.forEach((el) => {
      if (el.id === id) {
        setTargetRating({
          id: el.id,
          rating: el.rating
        });
      }
    });
    setOpenRatingEdit(true);
  };

  const handleRatingEditClose = () => {
    setOpenRatingEdit(false);
  };
  const handleReviewEditClose = () => {
    setOpenReviewEdit(false);
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

  const handleHistoryDelete = () => {
    if (allHistories.length === 0) {
      handleNotice(true);
      handleMessage('????????? ????????? ????????????.');
    } else if (CheckList.length > 0) {
      handleNotice(true);
      handleMessage(`?????? ????????? ?????????????????????????!${CheckList}`);
      setCheckList([]);
    } else {
      handleNotice(true);
      handleMessage('????????? ??????????????????.');
    }
  };

  const handleSearchClicked = () => {
    window.location.replace('/search');
  };

  return (
    <MyHistoryWrapper>
      <TopNavigation />
      <div className='main'>
        <div className='container'>
          <MyPageTable>
            <div className='field-container '>
              <label className='all'>
                <input
                  type='checkbox'
                  className='select-all'
                  onChange={onChangeAll}
                  checked={CheckList.length !== 0 ? CheckList.length === IdList.length : false}
                  disabled={!allHistories.length ? 'disable' : null}
                />
                <span className='description'>????????????</span>
              </label>
              <div className='delete-bnt description select' onClick={handleHistoryDelete}>??????????????????</div>
            </div>
            {allHistories.length === 0
              ? <div>
                <div className='no-items'>?????? ????????? ????????????. {'\n'} ??? ?????? ??????????????? ???????????????!</div>
                <button className='search-bnt' onClick={handleSearchClicked}>???????????? ??????</button>
                </div>
              : allHistories.map((el, idx) => {
                return (
                  <div className='card' key={idx}>
                    <input
                      type='checkbox'
                      className='select-one'
                      onChange={(e) => onChangeEach(e, el.id)}
                      checked={CheckList.includes(el.id)}
                    />
                    <img
                      className='dogwalker-img'
                      src={`/images/dog_images/dog_${el.dogwalkerId}.jpeg`}
                      alt={el.name}
                      onClick={() => handleClick(el.dogwalkerId)}
                    />
                    <div className='name'>{el.name}</div>
                    <div className='info'>{el.date} {el.time} {el.location}</div>
                    <div className='type'>{el.type} {el.duration}??? / {addComma(el.price)}???</div>
                    {givenRatingIds.includes(el.id)
                      ? (
                        <div
                          className='bnt rating'
                          onClick={() => handleRatingEditOpen(el.id)}
                        >
                          ?????? ??????
                        </div>
                        )
                      : (
                        <div className='bnt rating' onClick={() => handleRatingOpen(el.id)}>
                          ?????? ??????
                        </div>
                        )}
                    {givenReviewIds.includes(el.id)
                      ? (
                        <div
                          className='bnt review'
                          onClick={() => handleReviewEditOpen(el.id)}
                        >
                          ?????? ??????
                        </div>
                        )
                      : (
                        <div
                          className='bnt review'
                          onClick={() => handleReviewOpen(el.id, el.date)}
                        >
                          ?????? ??????
                        </div>
                        )}

                  </div>
                );
              })}
          </MyPageTable>
        </div>
        {openRating
          ? <Rating
              handleModal={handleRatingClose}
              handleMessage={handleMessage}
              handleNotice={handleNotice}
              historyInfo={historyInfo}
              token={token}
              modal={modal}
            />
          : null}
        {openRatingEdit
          ? <RatingEdit
              handleModal={handleRatingEditClose}
              handleMessage={handleMessage}
              handleNotice={handleNotice}
              token={token}
              modal={modal}
              targetRating={targetRating}
            />
          : null}
        {openReview
          ? (
            <Review
              modal={modal}
              handleModal={handleReviewClose}
              handleMessage={handleMessage}
              handleNotice={handleNotice}
              historyInfo={historyInfo}
              serviceDate={serviceDate}
              targetReview={targetReview}
              token={token}
            />
            )
          : null}
        {openReviewEdit
          ? (
            <ReviewEdit
              modal={modal}
              handleMessage={handleMessage}
              handleNotice={handleNotice}
              handleModal={handleReviewEditClose}
              targetReview={targetReview}
              token={token}
            />
            )
          : null}
      </div>
    </MyHistoryWrapper>
  );
}

export default MyHistory;
