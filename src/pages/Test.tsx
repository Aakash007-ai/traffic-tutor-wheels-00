import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RoadGame() {
  const lanePositions = ['15%', '50%', '85%']; // Lane positions
  const [carPosition, setCarPosition] = useState(0); // Start in left lane
  const [roadOffset, setRoadOffset] = useState(0);
  const [stopSignY, setStopSignY] = useState(-100); // Initial position
  const [showPopup, setShowPopup] = useState(false); // Popup visibility

  const moveLeft = () => setCarPosition((prev) => Math.max(0, prev - 1));
  const moveRight = () => setCarPosition((prev) => Math.min(2, prev + 1));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (showPopup) return; // Stop movement when popup is shown

    const interval = setInterval(() => {
      setRoadOffset((prev) => (prev + 5) % 100);
      setStopSignY((prev) => {
        if (prev > 400) return -100; // Reset to top
        return prev + 5;
      });

      // Stop car when it reaches stop sign in left lane
      if (carPosition === 0 && stopSignY >= 250) {
        setShowPopup(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [carPosition, showPopup, stopSignY]);

  const handleAnswer = (correct) => {
    if (correct) {
      setShowPopup(false); // Resume game
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-900'>
      {/* Road Container */}
      <div className='relative w-[60%] h-96 bg-gray-800 overflow-hidden border-4 border-gray-700'>
        {/* Moving Road */}
        <div
          className='absolute w-full h-full'
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0px, transparent 40px, white 40px, white 42px, transparent 42px, transparent 82px)',
            backgroundSize: '100% 100px',
            backgroundPositionY: `${roadOffset}px`
          }}
        ></div>

        {/* Lane Dividers */}
        <div className='absolute top-0 left-1/3 w-1 h-full bg-white opacity-50'></div>
        <div className='absolute top-0 left-2/3 w-1 h-full bg-white opacity-50'></div>

        {/* Stop Sign (Only in Left Lane) */}
        <motion.div
          className='absolute left-[13%] w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-full font-bold'
          animate={{ y: stopSignY }}
        >
          <img
            src='https://icon2.cleanpng.com/20180816/xcu/5a6e3b53a474dd00ce1a00e12a475d4e.webp'
            alt='stop'
          />
        </motion.div>

        {/* Car */}
        <motion.div
          className='absolute bottom-6 w-16 h-20 bg-blue-500 rounded-md'
          animate={{ left: lanePositions[carPosition], x: '-50%' }}
          transition={{ duration: 0.2, ease: 'linear' }}
        ></motion.div>
      </div>

      {/* Controls */}
      <div className='mt-4 flex gap-4'>
        <button
          onClick={moveLeft}
          className='px-4 py-2 bg-gray-600 text-white rounded'
          disabled={showPopup}
        >
          Left
        </button>
        <button
          onClick={moveRight}
          className='px-4 py-2 bg-gray-600 text-white rounded'
          disabled={showPopup}
        >
          Right
        </button>
      </div>

      {/* Popup when stop sign is reached */}
      {showPopup && (
        <div className='absolute top-1/3 bg-white p-6 rounded shadow-lg text-center'>
          <p className='text-lg font-bold mb-4'>
            What should you do when you see a STOP sign?
          </p>
          <div className='flex flex-col gap-2'>
            <button
              onClick={() => handleAnswer(true)}
              className='px-4 py-2 bg-green-600 text-white rounded'
            >
              Come to a complete stop and check for traffic.
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className='px-4 py-2 bg-red-600 text-white rounded'
            >
              Slow down and keep moving if the road looks clear.
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className='px-4 py-2 bg-red-600 text-white rounded'
            >
              Honk and drive through quickly.
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className='px-4 py-2 bg-red-600 text-white rounded'
            >
              Ignore it if you're in a hurry.
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
