import { useEffect, useRef } from "react";
import tune from "../assets/audio/tune.mp3";

// Ref-enabled Sound
const Sound = () => {
  const soundRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    setTimeout(() => {
      soundRef.current?.play();
    }, 1000);
    // soundRef.current.play();
  }, []);

  return (
    <div className={"absolute top-20 right-20 "}>
      <audio
        ref={soundRef}
        src={tune}
        autoPlay={true}
        loop={true}
        preload="auto"
      />
    </div>
  );
};
export default Sound;
