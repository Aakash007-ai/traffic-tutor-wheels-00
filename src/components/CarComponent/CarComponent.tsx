import React, { forwardRef, useState, useImperativeHandle, useRef } from 'react';
import './CarComponent.css';


export interface ICarComponentProp {
    direction?: 'left' | 'right' | 'up' | 'down';
}

// Define the exposed methods for ref
export interface CarComponentRef {
    toggleHeadlight: () => void;
    playHorn: () => void;
}

// Ref-enabled CarComponent
const CarComponent = forwardRef<CarComponentRef, ICarComponentProp>(({ direction = 'up' }, ref) => {
    const [isHeadlight, setIsHeadlight] = useState<boolean>(true);
    const hornSoundRef = useRef<HTMLAudioElement | null>(null);

    useImperativeHandle(ref, () => ({
        toggleHeadlight: () => setIsHeadlight(prev => !prev),
        playHorn: () => {
            if (hornSoundRef.current) {
                hornSoundRef.current.currentTime = 0; // Reset sound to start
                hornSoundRef.current.play();
            }
        },
    }));

    return (
        <div className={`car-container ${direction}`}>
            <div className='car'/>
            {isHeadlight && <>
                <div className="torchlight torchlight-left"/>
                <div className="torchlight torchlight-right"/>
            </>}
            <audio ref={hornSoundRef} src={'../../assets/audio/car-horn-90973.mp3'} preload="auto" />
        </div>
    );
});

export default CarComponent;
