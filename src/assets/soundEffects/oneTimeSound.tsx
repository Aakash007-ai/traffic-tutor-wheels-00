import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
} from "react";

import correctSound from "../../assets/audio/car-horn-90973.mp3";
import errorSound from "../../assets/audio/car-horn-90973.mp3";
import gameOverSound from "../../assets/audio/car-horn-90973.mp3";

// Define the exposed methods for ref
export interface SoundComponentRef {
  playSoundOnce?: () => void;
}
interface ISoundComponentProp {
  type: "correct" | "error" | "gameOver";
}

// Ref-enabled CarComponent
const OneTimeSound = forwardRef<SoundComponentRef, ISoundComponentProp>(
  ({ type }, ref) => {
    const SoundRef = useRef<HTMLAudioElement | null>(null);
    const soundType =
      type === "correct"
        ? correctSound
        : type === "error"
        ? errorSound
        : gameOverSound;

    useImperativeHandle(ref, () => ({
      playSoundOnce: () => {
        SoundRef.current.play();
      },
    }));

    return (
      <div className={"absolute"}>
        <audio
          ref={SoundRef}
          src={soundType}
          autoPlay={false}
          loop={true}
          preload="auto"
        />
      </div>
    );
  }
);

export default OneTimeSound;
