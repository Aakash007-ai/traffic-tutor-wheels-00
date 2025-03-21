import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { quizAppi } from "@/services";
import CarComponent, { CarComponentRef } from "./CarComponent/CarComponent";

import ZebraCrossing from "./ui/ZebraCrossing";
import compulsoryTurnLeft from "./../assets/signs/compulsoryTurnLeft.png";
import endOfSpeedRestriction from "./../assets/signs/endOfSpeedRestriction.png";
import giveWay from "./../assets/signs/giveWay.png";
import guardedLevelCross from "./../assets/signs/guardedLevelCross.png";
import oneWay from "./../assets/signs/oneWay.png";
import parkingOnTheRightAllowed from "./../assets/signs/parkingOnTheRightAllowed.png";
import pedestrianCrossing from "./../assets/signs/pedestrianCrossing.png";
import redLight from "./../assets/signs/redLight.png";
import rightTurnProhibited from "./../assets/signs/rightTurnProhibited.png";
import stop from "./../assets/signs/stop.png";
import zebraLines from "./../assets/signs/zebraLines.png";
import { QuizModal } from "./ui/quizModal";
import { QuizQuestion } from "./ui/quizModal/types";
import { OptionItem } from "./ui/quizModal/OptionItem";

const signImages = {
  "compulsoryTurnLeft.png": compulsoryTurnLeft,
  "endOfSpeedRestriction.png": endOfSpeedRestriction,
  "giveWay.png": giveWay,
  "guardedLevelCross.png": guardedLevelCross,
  "oneWay.png": oneWay,
  "parkingOnTheRightAllowed.png": parkingOnTheRightAllowed,
  "pedestrianCrossing.png": pedestrianCrossing,
  "redLight.png": redLight,
  "rightTurnProhibited.png": rightTurnProhibited,
  "stop.png": stop,
  "zebraLines.png": zebraLines,
};
const sampleQuestion = {
  id: "q1",
  text: "What is the largest planet in our solar system?",
  options: [
    {
      id: "opt1",
      letter: "A",
      text: "Jupiter",
      color: "red",
    },
    {
      id: "opt2",
      letter: "B",
      text: "Saturn",
      color: "green",
    },
    {
      id: "opt3",
      letter: "C",
      text: "Neptune",
      color: "yellow",
    },
    {
      id: "opt4",
      letter: "D",
      text: "Uranus",
      color: "blue",
    },
  ],
};

// Define the structure of the API response
interface ApiQuestionData {
  id: number;
  name: string;
  type: string;
  lang: string;
  options: {
    id: number;
    toolTip: string;
    sequence: number;
    weightage: number;
    allowComment: boolean;
    selectionMessage: string;
  }[];
  metadata: {
    ans: string | number;
    imageFile: string;
    position: string;
    duration?: string;
    score?: string;
    imageUrl?: string;
    imageType?: string;
  };
  explanation?: string;
  sequence: number; // Add sequence property for sorting
  validations?: unknown;
}

interface GameQuestion {
  id: number;
  name: string;
  options: {
    id: number;
    toolTip: string;
    sequence: number;
    weightage: number;
    allowComment: boolean;
    selectionMessage: string;
  }[];
  metadata: {
    ans: string | number;
    imageFile: string;
    position: string;
    duration?: string;
    score?: string;
    imageUrl?: string;
    imageType?: string;
  };
  explanation?: string;
  sequence?: number;
  type?: string;
  lang?: string;
  validations?: unknown;
}

// Import Question interface from Quiz component
interface Question {
  text: string;
  options: {
    text: string;
    correct: boolean;
  }[];
  explanation: string;
}

interface TrafficSign {
  type: "stop" | "yield" | "speed" | "school" | "pedestrian" | "ZebraCrossing";
  position: number;
  question: GameQuestion;
  imageUrl?: string;
  speed: number; // Store the speed at which the sign should move
}

interface RoadGameComponentProps {
  onAnswerQuestion: (
    correct: boolean,
    question: Question,
    questionScore: string
  ) => void;
  gameSpeed?: number;
  paused?: boolean;
  onQuestionShow?: () => void;
  initialSign?: boolean; // Flag to spawn a sign immediately
  setFinalAnswers: (questions: GameQuestion[]) => void;
  module?: string; // Add module prop
  setssId: (e: string) => void;
}

const RoadGameComponent: React.FC<RoadGameComponentProps> = ({
  onAnswerQuestion,
  gameSpeed = 10,
  paused = false,
  onQuestionShow,
  setFinalAnswers,
  module = "Module1",
  setssId,
}) => {
  const [roadOffset, setRoadOffset] = useState(0);
  const [currentSign, setCurrentSign] = useState<TrafficSign | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(
    null
  );
  const [signSpawnTimer, setSignSpawnTimer] = useState(40); // Start with a higher value to spawn sign sooner
  const [gameActive, setGameActive] = useState(true);
  const [carLane, setCarLane] = useState(1); // 0: left, 1: center, 2: right
  const [signSpeed, setSignSpeed] = useState(gameSpeed); // Track sign speed separately
  const [questionTimer, setQuestionTimer] = useState<number>(30); // 30 second timer for questions

  const carRef = useRef<CarComponentRef>(null);
  const [index, setIndex] = useState(0);
  const [questionsShown, setQuestionsShown] = useState<Set<number>>(new Set());
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<GameQuestion[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate car position based on lane
  const carPositions = ["25%", "50%", "75%"];
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
  const toggleHeadlight = () => {
    carRef?.current?.toggleHeadlight();
  };

  // Update sign speed when game speed changes
  useEffect(() => {
    if (!currentSign) {
      setSignSpeed(gameSpeed);
    }
  }, [gameSpeed, currentSign]);

  // Question timer effect
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;

    if (showPopup && currentQuestion) {
      // Reset timer to 30 seconds when question appears
      setQuestionTimer(30);

      // Start countdown
      timerInterval = setInterval(() => {
        setQuestionTimer((prevTime) => {
          const newTime = prevTime - 1;

          // If timer reaches 0, close popup and reduce life
          if (newTime <= 0) {
            // Clear the interval
            if (timerInterval) clearInterval(timerInterval);

            // Close popup
            setShowPopup(false);
            setCurrentQuestion(null);

            // Notify parent component of incorrect answer
            if (currentSign) {
              // Create a Question object from GameQuestion for the parent component
              const quizQuestion: Question = {
                text: currentSign.question.name,
                options: currentSign.question.options.map((opt) => ({
                  text: opt.toolTip,
                  correct:
                    Number(currentSign.question.metadata.ans) === opt.sequence,
                })),
                explanation:
                  currentSign.question.explanation ||
                  "No explanation available",
              };

              onAnswerQuestion(
                false,
                quizQuestion,
                currentSign.question.metadata.score || "0"
              );
            }

            // Reset the sign
            setCurrentSign(null);

            return 30; // Reset timer for next question
          }

          return newTime;
        });
      }, 1000);
    }

    // Clean up interval on component unmount or when popup closes
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [showPopup, currentQuestion, currentSign, onAnswerQuestion]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPopup, gameActive]);

  // Game loop
  useEffect(() => {
    if (paused || !gameActive || showPopup) return; // Stop the game loop when popup is shown

    const gameLoop = setInterval(() => {
      // Move road - use a larger value to make the animation smoother
      setRoadOffset((prev) => (prev + gameSpeed) % 200);

      // Check if all questions have been shown
      if (questionsShown.size >= questions.length && questions.length > 0) {
        // End the game if all questions have been shown
        if (onAnswerQuestion) {
          // Create a dummy question to trigger game over
          const dummyQuestion: Question = {
            text: "Game Complete",
            options: [],
            explanation: "You have completed all questions!",
          };
          // Call with false to trigger lives reduction and game over
          onAnswerQuestion(false, dummyQuestion, "0");
          onAnswerQuestion(false, dummyQuestion, "0");
          onAnswerQuestion(false, dummyQuestion, "0");
        }
        return;
      }

      // Move current sign if it exists
      if (currentSign) {
        const newPosition = currentSign.position + currentSign.speed;

        // Check if sign is approaching the car (stop before reaching the car)
        if (newPosition >= 300 && newPosition < 320) {
          setShowPopup(true);
          setCurrentQuestion(currentSign.question);

          // Mark this question as shown
          if (currentSign.question.id) {
            setQuestionsShown((prev) => {
              const newSet = new Set(prev);
              newSet.add(currentSign.question.id);
              return newSet;
            });
          }

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
            // Find a question that hasn't been shown yet
            let nextIndex = index;
            let attempts = 0;
            const maxAttempts = questions.length;

            // Try to find an unshown question
            while (
              attempts < maxAttempts &&
              questions[nextIndex] &&
              questionsShown.has(questions[nextIndex].id)
            ) {
              nextIndex = (nextIndex + 1) % questions.length;
              attempts++;
            }

            // If we've shown all questions, the game over check at the top will handle it
            if (attempts >= maxAttempts) {
              return prev;
            }

            console.log("Showing question:", questions[nextIndex].name);
            setCurrentSign({
              type: "ZebraCrossing",
              position: -100,
              speed: signSpeed, // Use the current sign speed
              question: questions[nextIndex],
            });

            setIndex((nextIndex + 1) % questions.length);
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
    onQuestionShow,
    index,
    questionsShown,
    onAnswerQuestion,
  ]);

  console.log("currentSign", currentSign);

  const handleAnswer = (index: number) => {
    console.log(Number(currentSign?.question?.metadata?.ans), "ans#####");
    console.log("index###", index);
    console.log(
      Number(currentSign?.question?.metadata?.ans) === index,
      "###check check check"
    );
    if (currentSign) {
      const isCorrect = Number(currentSign?.question?.metadata?.ans) === index;

      // Create a Question object from GameQuestion for the parent component
      const quizQuestion: Question = {
        text: currentSign.question.name,
        options: currentSign.question.options.map((opt) => ({
          text: opt.toolTip,
          correct: Number(currentSign.question.metadata.ans) === opt.sequence,
        })),
        explanation:
          currentSign.question.explanation || "No explanation available",
      };

      // Add the question to answered questions
      if (currentSign) {
        setAnsweredQuestions((prev) => [...prev, currentSign.question]);
        // Update the finalAnswers in the parent component
        setFinalAnswers([...answeredQuestions, currentSign.question]);
      }

      onAnswerQuestion(
        isCorrect,
        quizQuestion,
        currentSign?.question?.metadata?.score || "0"
      );
    }
    setShowPopup(false);
    setCurrentQuestion(null);

    // Reset the sign
    if (currentSign) {
      setCurrentSign(null);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("Fetching questions for module:", module);
        const data = await quizAppi.getQuestions(module);
        // Cast the API response to our ApiQuestionData type for proper typing
        setssId(data?.data?.ssId);
        const questionsArray = Object.values(data?.data?.initialQuestions)
          .map((q) => q as ApiQuestionData)
          .sort((a, b) => a.sequence - b.sequence);

        console.log("questionsArray", questionsArray);
        // Convert ApiQuestionData to GameQuestion
        const gameQuestions: GameQuestion[] = questionsArray.map((q) => ({
          id: q.id,
          name: q.name,
          type: q.type,
          lang: q.lang,
          sequence: q.sequence,
          metadata: q.metadata,
          options: q.options,
          explanation: q.explanation,
          validations: q.validations,
        }));

        setQuestions(gameQuestions);
        setAnsweredQuestions([]); // Reset answered questions when module changes
        setQuestionsShown(new Set()); // Reset shown questions when module changes
        setIndex(0); // Reset index when module changes
        console.log("Decoded Data:", data); // Ensure you're logging actual data
      } catch (err) {
        setError("Failed to fetch questions");
      }
    };

    fetchQuestions();
  }, [module]); // Re-fetch questions when module changes

  const getSignImages = (type: string) => {
    console.log("type", type);
    return signImages[type] || null; // Returns the image if found, otherwise null
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Road Container */}
      <div className="relative w-full h-[600px] overflow-hidden border-4 border-gray-700 rounded-lg">
        {/* Background */}
        <div className="absolute inset-0 bg-gray-800">
          {/* Left Green Strip */}
          <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-green-600">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 10px, transparent 10px, transparent 20px)",
                backgroundSize: "100% 20px",
                backgroundPositionY: `${roadOffset}px`,
              }}
            ></div>
          </div>

          {/* Right Green Strip */}
          <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-green-600">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 10px, transparent 10px, transparent 20px)",
                backgroundSize: "100% 20px",
                backgroundPositionY: `${roadOffset}px`,
              }}
            ></div>
          </div>

          {/* Road */}
          <div className="absolute left-[15%] right-[15%] top-0 bottom-0 bg-gray-700">
            {/* Lane Lines - positioned to separate lanes */}
            <div className="absolute inset-0">
              {/* Left Lane Line */}
              <div
                className="absolute left-[33.33%] top-0 bottom-0 w-[2px]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, white 0px, white 20px, transparent 20px, transparent 40px)",
                  backgroundSize: "2px 40px",
                  backgroundPositionY: `${roadOffset}px`,
                }}
              ></div>

              {/* Right Lane Line */}
              <div
                className="absolute left-[66.66%] top-0 bottom-0 w-[2px]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, white 0px, white 20px, transparent 20px, transparent 40px)",
                  backgroundSize: "2px 40px",
                  backgroundPositionY: `${roadOffset}px`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Traffic Sign (on the side of the road) */}
        {currentSign &&
          (currentSign?.question.metadata?.imageFile === "zebraLines.png" ? (
            <motion.div
              className="absolute left-[15%] right-[15%]"
              style={{
                left: "15%",
                right: "15%",
                top: currentSign.position,
              }}
            >
              <ZebraCrossing />
            </motion.div>
          ) : (
            <motion.div
              className="absolute w-12 h-12  text-white flex items-center justify-center rounded-full font-bold z-10"
              style={{
                left:
                  currentSign?.question?.metadata?.position === "LEFT"
                    ? "7%"
                    : "93%",
                top: currentSign.position,
                transform: "translateX(-50%)",
              }}
            >
              <img
                src={getSignImages(currentSign?.question.metadata?.imageFile)}
                alt={currentSign.type}
                // className="w-full h-full object-contain"
              />
            </motion.div>
          ))}

        {/* Car */}
        <motion.div
          className="absolute bottom-6"
          animate={{
            left: carPosition,
            x: "-50%",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <CarComponent ref={carRef} />
          {/* Car windows */}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={moveLeft}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          disabled={showPopup || !gameActive || carLane === 0}
        >
          Left
        </button>
        <button
          onClick={moveRight}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          disabled={showPopup || !gameActive || carLane === 2}
        >
          Right
        </button>

        <button
          onClick={toggleHeadlight}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          disabled={showPopup || !gameActive || carLane === 2}
        >
          Headlight
        </button>
        <button
          onMouseDown={() => carRef.current?.playHorn(true)} // Start horn
          onMouseUp={() => carRef.current?.playHorn(false)} // Stop horn
          onMouseLeave={() => carRef.current?.playHorn(false)} // Stop if moved out
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          disabled={showPopup || !gameActive || carLane === 2}
        >
          Horn
        </button>
      </div>

      {/* Question Popup */}

      {showPopup && currentQuestion && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-green-50/90 p-4 rounded-lg shadow-lg text-center max-w-md w-full z-20">
          <div className="flex justify-between items-center ">
            <p className="text-xl font-medium text-green-900 mb-3">
              {currentQuestion?.name}
            </p>
            {/* <div className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium  text-green-900">
              {questionTimer}s
            </div> */}
          </div>
          <div className="w-full bg-gray-300 h-2 mb-4 rounded-full overflow-hidden">
            <div
              className="bg-green-600 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(questionTimer / 30) * 100}%` }}
            ></div>
          </div>
          <div className="flex flex-col gap-2">
            {currentQuestion.options.map((option, index) => (
              <OptionItem
                key={option.id}
                option={option}
                isSelected={false}
                onSelect={() => handleAnswer(option?.sequence)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadGameComponent;
