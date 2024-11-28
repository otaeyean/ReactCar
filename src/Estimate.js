import SelectOption from "./components/SelectOption"
import { useLocation } from 'react-router-dom';

const Estimate = () => {
    const location = useLocation();
    const { carURL, Car, Index } = location.state || {}; //선택된 차량 이미지URL, 선택된 차량 정보, 선택된 차량 인덱스

    return (
        <>
            <div className="est">
                <SelectOption carURL={carURL} Car={Car} Index={Index}/>
            </div>
        </>
    );
};

export default Estimate;