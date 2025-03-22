import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import tune from "../assets/audio/tune.mp3";

const Sound = forwardRef((props, ref) => {
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (soundRef.current) {
        soundRef.current.play();
      }
    },
    pause: () => {
      if (soundRef.current) {
        soundRef.current.pause();
      }
    },
  }));

  return (
    <div className="absolute top-20 right-20">
      <audio ref={soundRef} src={tune} loop preload="auto" />
    </div>
  );
});

export default Sound;
