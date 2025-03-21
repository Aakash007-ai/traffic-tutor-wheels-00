import React, { forwardRef, useState, useImperativeHandle, useRef } from 'react';
import './CarComponent.css';
import hornSound from '../../assets/audio/car-horn-90973.mp3';

export interface ICarComponentProp {
    direction?: 'left' | 'right' | 'up' | 'down';
}

// Define the exposed methods for ref
export interface CarComponentRef {
    toggleHeadlight: () => void;
    playHorn: (isPlaying: boolean) => void;
    playHornOnce?: () => void;
}

// Ref-enabled CarComponent
const CarComponent = forwardRef<CarComponentRef, ICarComponentProp>(({ direction = 'up' }, ref) => {
    const [isHeadlight, setIsHeadlight] = useState<boolean>(true);
    const hornSoundRef = useRef<HTMLAudioElement | null>(null);
    const hornIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(ref, () => ({
        toggleHeadlight: () => setIsHeadlight(prev => !prev),
        playHorn: (isPlaying: boolean) => {
            if (hornSoundRef.current) {
              if (isPlaying) {
                hornSoundRef.current.currentTime = 0; // Reset sound to start
                hornSoundRef.current.play();
              } else {
                hornSoundRef.current.pause();
                hornSoundRef.current.currentTime = 0; // Reset sound
              }
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
            <audio ref={hornSoundRef} src={hornSound} autoPlay={false} loop={true} preload="auto" />
        </div>
    );
});

export default CarComponent;
