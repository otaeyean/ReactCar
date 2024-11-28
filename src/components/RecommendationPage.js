import React, { useState, useEffect } from 'react'; 
import "../styles/RecommendationPage.css"; 

// 이미지 파일을 불러오는 함수
const getCarImage = (model) => {
  try {
    // 띄어쓰기를 포함한 모델명 그대로 사용, 템플릿 리터럴을 사용하여 경로 처리
    return require(`../images/${model}.png`); // 이미지 경로 동적으로 가져오기
  } catch (e) {
    console.error("Image not found:", e); // 이미지가 없을 경우 에러 로그 출력
    return ""; // 이미지가 없을 경우 빈 문자열 반환
  }
};

function RecommendationPage() {
  // 상태 변수 정의
  const [selectedKeyword, setSelectedKeyword] = useState('recent'); // 선택된 키워드(기본값: 'recent')
  const [cars, setCars] = useState([]); // 차량 데이터
  const [showAll, setShowAll] = useState(false); // '더보기' 상태 관리 (초기값: false)

  // JSON 데이터 로드 (useEffect 사용)
  useEffect(() => {
    fetch('/data/Car.json') // JSON 파일에서 차량 데이터 가져오기
      .then((response) => response.json()) // JSON 형태로 파싱
      .then((data) => setCars(data)) // 파싱된 데이터를 cars 상태에 저장
      .catch((error) => console.error('Error loading cars data:', error)); // 에러 발생 시 콘솔에 출력
  }, []); // 빈 배열([])을 넣어서 최초 렌더링 시에만 실행되도록 설정

  // 날짜 파싱 함수 (YYYY년 MM월 DD일 형태의 날짜를 Date 객체로 변환)
  const parseDate = (dateString) => {
    const match = dateString.match(/(\d{4})년 (\d{2})월 (\d{2})일/); // 정규 표현식으로 날짜 포맷 매칭
    if (match) {
      const [_, year, month, day] = match;
      return new Date(year, month - 1, day); // Date 객체 생성 (month는 0부터 시작하므로 -1)
    }
    return new Date(dateString); // 매칭되지 않으면 그대로 Date 객체 생성
  };

  // 키워드 변경 시 호출되는 함수 (출시일, 가격 효율 등)
  const handleKeywordChange = (keyword) => {
    setSelectedKeyword(keyword); // 선택된 키워드 업데이트
    setShowAll(false); // '더보기'를 초기화하여 선택 시 초기화되도록 설정
  };

  // 차량 리스트를 선택된 키워드 기준으로 정렬
  const sortedCars = [...cars].sort((a, b) => {
    if (selectedKeyword === 'recent') {
      return parseDate(b.release_date) - parseDate(a.release_date); // 출시일 기준 정렬
    }
    if (selectedKeyword === 'value') {
      return a.price - b.price; // 가격 효율 기준 정렬
    }
    if (selectedKeyword === 'economy') {
      const economyA = parseFloat(a.fuel_efficiency.replace(/[^0-9.]/g, '')); // 연비에서 숫자만 추출
      const economyB = parseFloat(b.fuel_efficiency.replace(/[^0-9.]/g, ''));
      return economyB - economyA; // 연비 효율 기준 정렬
    }
    if (selectedKeyword === 'power') {
      const powerA = parseFloat(a.max_power.replace(/[^0-9.]/g, '')); // 최고 출력에서 숫자만 추출
      const powerB = parseFloat(b.max_power.replace(/[^0-9.]/g, ''));
      return powerB - powerA; // 최고 출력 기준 정렬
    }
    return 0; // 기본적으로 변경하지 않음
  });

  // '더보기' 버튼을 클릭하면 모든 항목을 표시
  const handleShowAll = () => {
    setShowAll(true); // 모든 항목을 표시하도록 상태 변경
  };

  return (
    <div className="recommendation-page">
      <h1 className="recommendation-title">자동차 추천</h1>

      {/* 탭 메뉴 (출시일, 가격 효율, 연비 효율, 최고 출력) */}
      <div className="tab-menu">
        <button
          className={selectedKeyword === 'recent' ? 'active' : ''} // 선택된 키워드에 따라 스타일 적용
          onClick={() => handleKeywordChange('recent')}
        >
          출시일
        </button>
        <button
          className={selectedKeyword === 'value' ? 'active' : ''} // 선택된 키워드에 따라 스타일 적용
          onClick={() => handleKeywordChange('value')}
        >
          가격 효율
        </button>
        <button
          className={selectedKeyword === 'economy' ? 'active' : ''} // 선택된 키워드에 따라 스타일 적용
          onClick={() => handleKeywordChange('economy')}
        >
          연비 효율
        </button>
        <button
          className={selectedKeyword === 'power' ? 'active' : ''} // 선택된 키워드에 따라 스타일 적용
          onClick={() => handleKeywordChange('power')}
        >
          최고 출력
        </button>
      </div>

      {/* 차량 리스트 */}
      <div className="car-list">
        {sortedCars.slice(0, showAll ? sortedCars.length : 3).map((car, index) => (
          <div key={index} className="car-card">
            {/* 차량의 순위를 표시 */}
            <div className="top-label">TOP {index + 1}</div>

            {/* 차량 이미지 */}
            <div className="car-image">
              <img
                src={getCarImage(car.model)} // 동적으로 이미지 불러오기
                alt={car.model}
                style={{ width: "100%", height: "auto", borderRadius: "10px" }}
              />
            </div>

            {/* 차량 정보 */}
            <div className="car-content">
              <h3>{car.model}</h3>
              <p>
                <span className="car-label">출시 연도:</span>{' '}
                <span className="car-value">
                  {car.release_date
                    ? parseDate(car.release_date).getFullYear()
                    : 'N/A'}
                </span>
              </p>
              <p>
                <span className="car-label">엔진:</span>{' '}
                <span className="car-value">{car.engine_type}</span>
              </p>
              <p>
                <span className="car-label">배기량:</span>{' '}
                <span className="car-value">{car.displacement}</span>
              </p>
              <p>
                <span className="car-label">최고 출력:</span>{' '}
                <span className="car-value">{car.max_power}</span>
              </p>
              <p>
                <span className="car-label">연비:</span>{' '}
                <span className="car-value">{car.fuel_efficiency}</span>
              </p>

              {/* 구분선 */}
              <div className="divider"></div>

              {/* 차량 가격 */}
              <p className="car-price">
                <span className="car-label">가격:</span>{' '}
                <span className="car-value">₩{car.price.toLocaleString()}</span>
              </p>

              {/* 버튼들 */}
              <div className="car-buttons">
                <button
                  className="detail-button"
                  onClick={() => {
                    window.location.href = '/detail-page'; // 자세히 보기 버튼 클릭 시 페이지 이동
                  }}
                >
                  자세히 보기
                </button>
                <button
                  className="quote-button"
                  onClick={() => {
                    window.location.href = '/quote-page'; // 견적 내기 버튼 클릭 시 페이지 이동
                  }}
                >
                  견적 내기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {!showAll && (
        <button className="show-more-button" onClick={handleShowAll}>
          더보기
        </button>
      )}
    </div>
  );
}

export default RecommendationPage;
