import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Question {
  text: string;
  options: {
    text: string;
    correct: boolean;
  }[];
  explanation: string;
}

interface TrafficSign {
  type: 'stop' | 'yield' | 'speed' | 'school' | 'pedestrian';
  position: number;
  question: Question;
  imageUrl?: string;
  speed: number; // Store the speed at which the sign should move
}

interface RoadGameComponentProps {
  onAnswerQuestion: (correct: boolean, question: Question) => void;
  questions: Question[];
  gameSpeed?: number;
  paused?: boolean;
  onQuestionShow?: () => void;
  initialSign?: boolean; // Flag to spawn a sign immediately
}

const RoadGameComponent: React.FC<RoadGameComponentProps> = ({
  onAnswerQuestion,
  questions,
  gameSpeed = 10,
  paused = false,
  onQuestionShow
}) => {
  const [roadOffset, setRoadOffset] = useState(0);
  const [currentSign, setCurrentSign] = useState<TrafficSign | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [signSpawnTimer, setSignSpawnTimer] = useState(40); // Start with a higher value to spawn sign sooner
  const [gameActive, setGameActive] = useState(true);
  const [carLane, setCarLane] = useState(1); // 0: left, 1: center, 2: right
  const [signSpeed, setSignSpeed] = useState(gameSpeed); // Track sign speed separately

  // Calculate car position based on lane
  const carPositions = ['25%', '50%', '75%'];
  const carPosition = carPositions[carLane];

  // Move car left or right
  const moveLeft = () => {
    if (!showPopup && gameActive) {
      setCarLane((prev) => Math.max(0, prev - 1));
    }
  };

  const moveRight = () => {
    if (!showPopup && gameActive) {
      setCarLane((prev) => Math.min(2, prev + 1));
    }
  };

  // Update sign speed when game speed changes
  useEffect(() => {
    if (!currentSign) {
      setSignSpeed(gameSpeed);
    }
  }, [gameSpeed, currentSign]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPopup, gameActive]);

  // Game loop
  useEffect(() => {
    if (paused || !gameActive || showPopup) return; // Stop the game loop when popup is shown

    const gameLoop = setInterval(() => {
      // Move road - use a larger value to make the animation smoother
      setRoadOffset((prev) => (prev + gameSpeed) % 200);

      // Move current sign if it exists
      if (currentSign) {
        const newPosition = currentSign.position + currentSign.speed;

        // Check if sign is approaching the car (stop before reaching the car)
        if (newPosition >= 200 && newPosition < 220) {
          setShowPopup(true);
          setCurrentQuestion(currentSign.question);
          setCurrentSign({ ...currentSign, position: newPosition });
          // Notify parent component that a question is being shown
          if (onQuestionShow) {
            onQuestionShow();
          }
          return;
        }

        // Remove sign if it goes off screen
        if (newPosition > 400) {
          setCurrentSign(null);
        } else {
          setCurrentSign({ ...currentSign, position: newPosition });
        }
      } else {
        // Spawn new sign after a shorter delay
        setSignSpawnTimer((prev) => {
          if (prev > 50) {
            // Reduced from 100 to 50 for more frequent signs
            // Spawn a new sign
            const randomQuestionIndex = Math.floor(
              Math.random() * questions.length
            );

            setCurrentSign({
              type: 'stop',
              position: -100,
              speed: signSpeed, // Use the current sign speed
              question: questions[randomQuestionIndex],
              imageUrl:
                'https://icon2.cleanpng.com/20180816/xcu/5a6e3b53a474dd00ce1a00e12a475d4e.webp'
            });

            return 0;
          }
          return prev + 1;
        });
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [
    currentSign,
    gameSpeed,
    signSpeed,
    paused,
    questions,
    gameActive,
    showPopup,
    onQuestionShow
  ]);

  const handleAnswer = (correct: boolean) => {
    if (currentQuestion) {
      onAnswerQuestion(correct, currentQuestion);
    }
    setShowPopup(false);
    setCurrentQuestion(null);

    // Reset the sign
    if (currentSign) {
      setCurrentSign(null);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      {/* Road Container */}
      <div className='relative w-full h-[600px] overflow-hidden border-4 border-gray-700 rounded-lg'>
        {/* Background */}
        <div className='absolute inset-0 bg-gray-800'>
          {/* Left Green Strip */}
          <div className='absolute left-0 top-0 bottom-0 w-[15%] bg-green-600'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 10px, transparent 10px, transparent 20px)',
                backgroundSize: '100% 20px',
                backgroundPositionY: `${roadOffset}px`
              }}
            ></div>
          </div>

          {/* Right Green Strip */}
          <div className='absolute right-0 top-0 bottom-0 w-[15%] bg-green-600'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 10px, transparent 10px, transparent 20px)',
                backgroundSize: '100% 20px',
                backgroundPositionY: `${roadOffset}px`
              }}
            ></div>
          </div>

          {/* Road */}
          <div className='absolute left-[15%] right-[15%] top-0 bottom-0 bg-gray-700'>
            {/* Lane Lines - positioned to separate lanes */}
            <div className='absolute inset-0'>
              {/* Left Lane Line */}
              <div
                className='absolute left-[33.33%] top-0 bottom-0 w-[2px]'
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, white 0px, white 20px, transparent 20px, transparent 40px)',
                  backgroundSize: '2px 40px',
                  backgroundPositionY: `${roadOffset}px`
                }}
              ></div>

              {/* Right Lane Line */}
              <div
                className='absolute left-[66.66%] top-0 bottom-0 w-[2px]'
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, white 0px, white 20px, transparent 20px, transparent 40px)',
                  backgroundSize: '2px 40px',
                  backgroundPositionY: `${roadOffset}px`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Traffic Sign (on the side of the road) */}
        {currentSign && (
          <motion.div
            className='absolute w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-full font-bold z-10 shadow-lg border-2 border-white'
            style={{
              left: '10%',
              top: currentSign.position,
              transform: 'translateX(-50%)'
            }}
          >
            {currentSign.imageUrl ? (
              <img
                src={currentSign.imageUrl}
                alt={currentSign.type}
                className='w-full h-full object-contain'
              />
            ) : (
              <span>{currentSign.type.charAt(0).toUpperCase()}</span>
            )}
          </motion.div>
        )}

        {/* Car */}
        <motion.div
          className='absolute bottom-6 w-16 h-24 bg-blue-500 rounded-md z-10 shadow-lg'
          animate={{
            left: carPosition,
            x: '-50%'
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Car windows */}
          <div className='absolute top-1 left-1 right-1 h-1/3 bg-blue-200/30 rounded-t-sm'></div>
          <div className='absolute top-[40%] left-1 right-1 h-[15%] bg-blue-200/30'></div>

          {/* Car lights */}
          <div className='absolute bottom-1 left-2 w-2 h-2 rounded-full bg-red-500'></div>
          <div className='absolute bottom-1 right-2 w-2 h-2 rounded-full bg-red-500'></div>

          {/* Car wheels */}
          <div className='absolute bottom-0 left-0 w-3 h-6 bg-black -translate-x-1 translate-y-1 rounded-l-md'></div>
          <div className='absolute bottom-0 right-0 w-3 h-6 bg-black translate-x-1 translate-y-1 rounded-r-md'></div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className='mt-4 flex gap-4'>
        <button
          onClick={moveLeft}
          className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors'
          disabled={showPopup || !gameActive || carLane === 0}
        >
          Left
        </button>
        <button
          onClick={moveRight}
          className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors'
          disabled={showPopup || !gameActive || carLane === 2}
        >
          Right
        </button>
      </div>

      {/* Question Popup */}
      {showPopup && currentQuestion && (
        <div className='absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full z-20'>
          <p className='text-lg font-bold mb-4'>{currentQuestion.text}</p>
          <div className='flex flex-col gap-2'>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.correct)}
                className='px-4 py-2 text-white rounded transition-colors bg-blue-600 hover:bg-blue-700'
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadGameComponent;
