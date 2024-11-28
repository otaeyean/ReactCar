import React, { useState, useEffect } from 'react';
import './CarInfo.css';
import CarViewer from './CarViewer'; 
import { CSSTransition } from 'react-transition-group';

function CarInfo({ car, onBack }) {
  const reviews = [
    { text: "이 자동차는 정말 훌륭해요! 타기 편하고 디자인도 멋져요.", rating: 5 },
    { text: "연비가 좋고 가성비가 뛰어난 차량이에요.", rating: 4 },
    { text: "운전하기 아주 즐겁고, 승차감도 매우 좋습니다.", rating: 5 },
    { text: "이 자동차는 정말 훌륭해요! 타기 편하고 디자인도 멋져요.", rating: 5 },
    { text: "연비가 좋고 가성비가 뛰어난 차량이에요.", rating: 4 },
    { text: "운전하기 아주 즐겁고, 승차감도 매우 좋습니다.", rating: 5 },
  ];

  const [visibleReviews, setVisibleReviews] = useState([]);
  
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i} className="star-filled">★</span>); // 채워진 별
      } else {
        stars.push(<span key={i} className="star-empty">☆</span>); // 빈 별
      }
    }
    return stars;
  };

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < reviews.length) {
        setVisibleReviews((prevReviews) => [...prevReviews, reviews[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval); // 모든 리뷰가 표시되면 인터벌 종료
      }
    }, 2000); // 2초마다 리뷰 하나씩 표시

    return () => clearInterval(interval); // 컴포넌트가 unmount되면 interval을 정리
  }, []);

  return (
    <div className="car-info-container">
      <div className="car-image">
        <CarViewer
          carName={car.model}
          fieldName="field1"
          color="Black"
          width="1600px"
          height="700px"
        />
      </div>
      <div className="car-details-reviews">
        <div className="car-details">
          <h2>자동차 정보</h2>
          <p><strong>모델:</strong> {car.model}</p>
          <p><strong>브랜드:</strong> {car.brand}</p>
          <p><strong>카테고리:</strong> {car.category}</p>
          <p><strong>가격:</strong> {car.price}</p>
          <p><strong>출시일:</strong> {car.release_date}</p>
          <p><strong>무게:</strong> {car.weight}</p>
          <p><strong>엔진형식:</strong> {car.engine_type}</p>
          <p><strong>배기량:</strong> {car.displacement}</p>
          <p><strong>최대 토크:</strong> {car.max_torque}</p>
          <p><strong>최고 출력:</strong> {car.max_power}</p>
          <p><strong>연비:</strong> {car.fuel_efficiency}</p>
          <button onClick={onBack} className="back-button">뒤로 가기</button>
        </div>
        <div className="reviews">
          <h3>다른 사람들의 후기를 확인해보세요!</h3>
          <div className="average-rating">
            <h3>전체 평점: {averageRating.toFixed(1)}점</h3>
            <div>{renderStars(Math.round(averageRating))}</div>
          </div>
          <div className="review-list">
            {visibleReviews.map((review, index) => (
              <CSSTransition
                key={index}
                in={true}
                timeout={500}
                classNames="review"
                appear
              >
                <div className="review-item">
                  <div className="review-text">{review.text}</div>
                  <div className="review-rating">
                    {renderStars(review.rating)} ({review.rating}점)
                  </div>
                </div>
              </CSSTransition>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarInfo;
