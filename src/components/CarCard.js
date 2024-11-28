import React, { useState } from 'react';
import { Card, Button } from 'antd';
import './CarCard.css';

const CarCard = ({ car, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="car-card-container">
      <Card
        hoverable
        className="car-card"
        cover={
          <img
            alt={car.model}
            src={require(`../images/${car.model}.png`)}
            className="car-card-image"
          />
        }
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3 className="car-card-title">{car.model}</h3>
        <p className="car-card-info">브랜드: {car.brand}</p>
        <p className="car-card-price">가격: {car.price.toLocaleString()}원</p>
        <div className="car-card-buttons">
          <Button
            type="primary"
            className="car-card-button-primary"
            onClick={() => onSelect(car)}
          >
            자세히 보기
          </Button>
          <Button type="default" className="car-card-button-secondary">
            견적 내기
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CarCard;
