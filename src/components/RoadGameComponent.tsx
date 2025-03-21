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
  lane: number;
  y: number;
  question: Question;
  imageUrl?: string;
}

interface RoadGameComponentProps {
  onAnswerQuestion: (correct: boolean, question: Question) => void;
  questions: Question[];
  gameSpeed?: number;
  paused?: boolean;
  onQuestionShow?: () => void;
}

const RoadGameComponent: React.FC<RoadGameComponentProps> = ({
  onAnswerQuestion,
  questions,
  gameSpeed = 5,
  paused = false,
  onQuestionShow
}) => {
  const lanePositions = ['15%', '50%', '85%']; // Lane positions
  const [carPosition, setCarPosition] = useState(1); // Start in middle lane
  const [roadOffset, setRoadOffset] = useState(0);
  const [currentSign, setCurrentSign] = useState<TrafficSign | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [signSpawnTimer, setSignSpawnTimer] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  const moveLeft = () => {
    if (!showPopup && gameActive) {
      setCarPosition((prev) => Math.max(0, prev - 1));
    }
  };

  const moveRight = () => {
    if (!showPopup && gameActive) {
      setCarPosition((prev) => Math.min(2, prev + 1));
    }
  };

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
      // Move road
      setRoadOffset((prev) => (prev + gameSpeed) % 100);

      // Move current sign if it exists
      if (currentSign) {
        const newY = currentSign.y + gameSpeed;

        // Check if sign is approaching the car (stop before reaching the car)
        if (newY >= 200 && newY < 220 && currentSign.lane === carPosition) {
          setShowPopup(true);
          setCurrentQuestion(currentSign.question);
          setCurrentSign({...currentSign, y: newY});
          // Notify parent component that a question is being shown
          if (onQuestionShow) {
            onQuestionShow();
          }
          return;
        }

        // Remove sign if it goes off screen
        if (newY > 400) {
          setCurrentSign(null);
        } else {
          setCurrentSign({ ...currentSign, y: newY });
        }
      } else {
        // Spawn new sign after a delay
        setSignSpawnTimer((prev) => {
          if (prev > 100) {
            // Spawn a new sign
            const randomLane = Math.floor(Math.random() * 3);
            const randomQuestionIndex = Math.floor(
              Math.random() * questions.length
            );

            setCurrentSign({
              type: 'stop',
              lane: randomLane,
              y: -100,
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
    carPosition,
    currentSign,
    gameSpeed,
    paused,
    questions,
    gameActive,
    showPopup
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
      <div className='relative w-full h-96 bg-gray-800 overflow-hidden border-4 border-gray-700 rounded-lg'>
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

        {/* Traffic Sign */}
        {currentSign && (
          <motion.div
            className='absolute w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-full font-bold'
            style={{
              left: lanePositions[currentSign.lane],
              top: currentSign.y,
              x: '-50%'
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
          className='absolute bottom-6 w-16 h-20 bg-blue-500 rounded-md'
          animate={{ left: lanePositions[carPosition], x: '-50%' }}
          transition={{ duration: 0.2, ease: 'linear' }}
        >
          <div className='absolute top-1 left-1 right-1 h-1/2 bg-blue-200/30 rounded-t-lg'></div>
          <div className='absolute bottom-1 left-2 w-2 h-2 rounded-full bg-red-500'></div>
          <div className='absolute bottom-1 right-2 w-2 h-2 rounded-full bg-red-500'></div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className='mt-4 flex gap-4'>
        <button
          onClick={moveLeft}
          className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors'
          disabled={showPopup || !gameActive}
        >
          Left
        </button>
        <button
          onClick={moveRight}
          className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors'
          disabled={showPopup || !gameActive}
        >
          Right
        </button>
      </div>

      {/* Question Popup */}
      {showPopup && currentQuestion && (
        <div className='absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full z-10'>
          <p className='text-lg font-bold mb-4'>{currentQuestion.text}</p>
          <div className='flex flex-col gap-2'>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.correct)}
                className="px-4 py-2 text-white rounded transition-colors bg-blue-600 hover:bg-blue-700"
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
