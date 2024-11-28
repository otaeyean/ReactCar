import React, { useState, useEffect } from 'react';
import "../styles/ComparisonPage.css";

function ComparisonPage() {
  // 차량 데이터와 선택된 차량 상태
  const [cars, setCars] = useState([]); // 전체 차량 데이터
  const [filteredCars, setFilteredCars] = useState([]); // 필터링된 차량 목록
  const [selectedCars, setSelectedCars] = useState([null, null]); // 선택된 차량 (최대 4개까지)
  const [showSearch, setShowSearch] = useState(false); // 차량 검색 모달 표시 여부
  const [currentCardIndex, setCurrentCardIndex] = useState(null); // 현재 카드의 인덱스
  const [highlightedIndexes, setHighlightedIndexes] = useState([]); // 비교된 데이터 강조 상태

  // 데이터를 로드하여 cars와 filteredCars 상태에 저장
  useEffect(() => {
    fetch("/data/cars.json")
      .then((response) => response.json())
      .then((data) => {
        setCars(data); // 전체 차량 데이터 설정
        setFilteredCars(data); // 필터링된 차량 초기화
      });
  }, []);

  // 차량을 추가할 때, 선택된 카드 인덱스를 설정하고 모달을 띄움
  const handleAdd = (index) => {
    setCurrentCardIndex(index);
    setFilteredCars(cars); // 검색 초기화
    setShowSearch(true); // 차량 선택 모달을 표시
  };

  // 차량을 선택하면, 해당 차량을 선택된 차량 리스트에 저장
  const handleSelectCar = (car) => {
    const updatedCars = [...selectedCars];
    updatedCars[currentCardIndex] = car;
    setSelectedCars(updatedCars); // 선택된 차량 업데이트
    setShowSearch(false); // 차량 선택 후 모달 닫기
    setHighlightedIndexes([]); // 비교 상태 초기화
  };

  // 차량 검색 필터링 함수
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase(); // 입력된 검색어
    const filtered = cars.filter(
      (car) => car.model && car.model.toLowerCase().includes(query)
    );
    setFilteredCars(filtered); // 검색된 차량 목록 업데이트
  };

  // 선택된 차량을 초기화하는 함수
  const handleResetCar = (index) => {
    const updatedCars = [...selectedCars];
    updatedCars[index] = null; // 선택된 차량을 null로 초기화
    setSelectedCars(updatedCars); // 선택된 차량 업데이트
    setHighlightedIndexes([]); // 비교 상태 초기화
  };

  // 차량 카드 추가 (최대 4개까지)
  const handleAddCard = () => {
    if (selectedCars.length < 4) {
      setSelectedCars([...selectedCars, null]); // 선택된 차량에 새로운 카드 추가
    }
  };

  // 차량 카드 제거
  const handleRemoveCard = (index) => {
    if (selectedCars.length > 2) {
      const updatedCars = [...selectedCars];
      updatedCars.splice(index, 1); // 카드 삭제
      setSelectedCars(updatedCars); // 선택된 차량 업데이트
      setHighlightedIndexes([]); // 비교 상태 초기화
    }
  };

  // 차량 비교 함수 (최고 값 하이라이트)
  const compareCars = () => {
    const nonNullCars = selectedCars.filter((car) => car !== null); // null이 아닌 차량만 필터링
    if (nonNullCars.length < 2) return; // 두 대 이상의 차량이 선택되지 않으면 비교 불가

    const attributes = ["price", "fuel_efficiency", "displacement", "max_torque", "max_power", "weight"]; // 비교할 속성
    const highlights = []; // 하이라이트를 위한 배열

    // 각 속성별 최고 값을 찾아 하이라이트
    attributes.forEach((attr) => {
      const bestValue = Math.max(
        ...nonNullCars.map((car) => {
          const value = car[attr];
          return typeof value === "string"
            ? parseFloat(value.replace(/[^0-9.]/g, "")) // 숫자만 추출
            : value;
        })
      );

      highlights.push(
        selectedCars.map((car) => {
          if (!car) return false;
          const value = car[attr];
          const numericValue =
            typeof value === "string"
              ? parseFloat(value.replace(/[^0-9.]/g, ""))
              : value;
          return numericValue === bestValue;
        })
      );
    });

    setHighlightedIndexes(highlights); // 하이라이트 상태 업데이트
  };

  // 차량 이미지 경로 가져오는 함수
  const getCarImage = (model) => {
    try {
      return require(`../images/${model}.png`); // 모델명을 기준으로 이미지 파일 경로를 가져옴
    } catch (e) {
      console.error("Image not found:", e);
      return ""; // 이미지가 없을 경우 빈 문자열
    }
  };

  return (
    <div className="comparison-page">
      <h1 className="comparison-title">차량 비교</h1>
      <div
        className="comparison-container"
        style={{
          gridTemplateColumns: `repeat(${selectedCars.length}, ${
            selectedCars.length === 2 ? "40%" : selectedCars.length === 3 ? "30%" : "22%"
          })`,
          justifyContent: selectedCars.length === 2 ? "center" : "space-between", // 두 대일 경우 중앙 정렬
        }}
      >
        {/* 선택된 차량들을 카드 형식으로 출력 */}
        {selectedCars.map((car, index) => (
          <div
            key={index}
            className={`comparison-card ${
              highlightedIndexes.some((h) => h[index]) ? "highlight-card" : ""
            }`}
          >
            {car ? (
              <>
                {/* 차량 이미지 표시 */}
                <div className="car-image">
                  <img
                    src={getCarImage(car.model)} // 띄어쓰기가 포함된 모델명 그대로 사용
                    alt={car.model}
                    style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                  />
                </div>

                {/* 차량 정보 */}
                <div className="car-data">
                  <p>
                    <span>모델:</span> {car.model}
                  </p>
                  <p>
                    <span>엔진:</span> {car.engine_type}
                  </p>
                  <p className={highlightedIndexes[2]?.[index] ? "highlight" : ""}>
                    <span>배기량:</span> {car.displacement}
                  </p>
                  <p className={highlightedIndexes[3]?.[index] ? "highlight" : ""}>
                    <span>최고 토크:</span> {car.max_torque}
                  </p>
                  <p className={highlightedIndexes[4]?.[index] ? "highlight" : ""}>
                    <span>최고 출력:</span> {car.max_power}
                  </p>
                  <p className={highlightedIndexes[1]?.[index] ? "highlight" : ""}>
                    <span>연비:</span> {car.fuel_efficiency}
                  </p>
                  <p className={highlightedIndexes[0]?.[index] ? "highlight" : ""}>
                    <span>가격:</span> ₩{car.price.toLocaleString()}
                  </p>
                  <p>
                    <span>중량:</span> {car.weight}
                  </p>
                </div>

                {/* 카드 하단 버튼들 */}
                <div className="button-group">
                  <button className="reset-button" onClick={() => handleResetCar(index)}>
                    다시 선택
                  </button>
                  {selectedCars.length > 2 && (
                    <button className="remove-button" onClick={() => handleRemoveCard(index)}>
                      차량 삭제
                    </button>
                  )}
                  <button className="detail-button" onClick={() => window.location.href = 'https://your-website.com/car-details'}>
                    자세히 보기
                  </button>
                </div>
              </>
            ) : (
              <div className="car-placeholder">
                <p>차량 선택 하기</p>
                <button className="add-button" onClick={() => handleAdd(index)}>
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 카드 추가 및 비교 버튼 */}
      <div className="actions-container">
        <button className="add-card-button" onClick={handleAddCard} disabled={selectedCars.length >= 4}>
          차량 추가
        </button>
        <button
          className={`compare-button ${selectedCars.filter((car) => car !== null).length >= 2 ? "active" : ""}`}
          onClick={compareCars}
          disabled={selectedCars.filter((car) => car !== null).length < 2}
        >
          비교하기
        </button>
      </div>

      {/* 차량 검색 모달 */}
      {showSearch && (
        <div className="search-modal">
          <div className="search-box">
            <h2>차량 검색</h2>
            <input
              type="text"
              placeholder="차량 이름 검색"
              className="search-input"
              onChange={handleSearch}
            />
            {filteredCars.length > 0 ? (
              <ul className="search-results">
                {filteredCars.map((car) => (
                  <li key={car.model} className="search-item" onClick={() => handleSelectCar(car)}>
                    {car.model}
                  </li>
                ))}
              </ul>
            ) : (
              <p>검색된 차량이 없습니다.</p>
            )}
            <button className="close-button" onClick={() => setShowSearch(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComparisonPage;
