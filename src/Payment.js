import { useLocation } from 'react-router-dom';
import PaymentOption from './components/PaymentOption';
import { Fragment } from 'react';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const Payment = () => {
    const location = useLocation();
    const { Car, price, optionList } = location.state || {};
    return (
        <Fragment> 
            <h2 className='paymenth2'> <IoMdCheckmarkCircleOutline style={{width:'2vw', height:'2.7vh'}}/> 선택된 옵션 확인 </h2>
            <div className="checkoption">
                <ul>
                    <li><p className='attribute'> 차량 </p><p className='attrval'> {Car.model} </p></li>
                    <li><p className='attribute'> 가격 </p><p className='attrval'> {price.toLocaleString()} 원</p></li>
                    <li><p className='attribute'> 편의 </p><p className='attrval'> {Array.isArray(optionList.convs) ? optionList.convs.join(", ") : "" } </p></li>
                    <li><p className='attribute'> 보조 </p><p className='attrval'> {Array.isArray(optionList.assists) ? optionList.assists.join(", ") : "" } </p></li>
                </ul>
            </div>
            <div className='line'></div>

            <PaymentOption  Car={Car} price={price} optionList={optionList} />
        </Fragment>
    );
};

export default Payment;
