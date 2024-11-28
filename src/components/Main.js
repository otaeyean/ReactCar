import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import Changebtn from './Changebtn';
import AnimationImage from './AnimationImage';

const Main = ({ Index, setBackgroundIndex, backgroundArray, Car}) => {
    const createArray = (length) => [...Array(length)];
    const changeBackground = (direction) => {
        if (direction === 'left') {
            setBackgroundIndex((prevIndex) => (prevIndex === 0 ? backgroundArray.length - 1 : prevIndex - 1));
        } else {
            setBackgroundIndex((prevIndex) => (prevIndex === backgroundArray.length - 1 ? 0 : prevIndex + 1));
        }
    };

    return (
    <>
        <div className="main">
            <AnimationImage carURLArray={backgroundArray} Index={Index} Car={Car}/>

            <button className='leftbtn' onClick={() => changeBackground('left')}> <SlArrowLeft /> </button>
            <div className="changebtn"> 
                {createArray(backgroundArray.length).map((n, i) => 
                    <Changebtn
                        key={i}
                        selectedIndex={Index === i}
                        setIndex={() => setBackgroundIndex(i)}
                    />
                )}
            </div>
            <button className='rightbtn' onClick={() => changeBackground('right')}> <SlArrowRight /> </button>
        </div>
    </>
    );
};

export default Main;