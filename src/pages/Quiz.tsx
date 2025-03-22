import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Heart, Zap, Trophy, Car } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AnimatedTransition from "@/components/AnimatedTransition";
import RoadGameComponent from "@/components/RoadGameComponent";
import { ProctoringSystem } from "@/components/Proctoring";
import quizAppi from "@/services";
import carImage from "../assets/images/landing_car.png";

// Define the GameQuestion interface to match RoadGameComponent
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

// Define the Question interface
interface Question {
  text: string;
  options: {
    text: string;
    correct: boolean;
  }[];
  explanation: string;
}

// Traffic questions

const Quiz: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  // const [distance, setDistance] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(10); // Increased from 8 to 12
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(
    null
  );
  const [lastExplanation, setLastExplanation] = useState<string | null>(null);
  const [questionActive, setQuestionActive] = useState(false);
  const [finalAnswers, setFinalAnswers] = useState<GameQuestion[]>([]);
  const [firstSignSpawned, setFirstSignSpawned] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>("Module1");
  const [showModuleSelection, setShowModuleSelection] = useState(true);
  const [highestModule1Score, setHighestModule1Score] = useState<number>(0);
  const [module2Unlocked, setModule2Unlocked] = useState<boolean>(false);
  const [ssId, setssId] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isProctoringEnabled, setIsProctoringEnabled] = useState(false);
  const [language, setLanguage] = useState("ENGLISH");

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const fetchAccessToken = () => {
        const cookies = document.cookie.split("; ");
        const accessTokenCookie = cookies.find((row) =>
          row.startsWith("accessToken=")
        );
        return accessTokenCookie ? accessTokenCookie.split("=")[1] : null;
      };

      const token = fetchAccessToken();
      if (!token) {
        console.error("Access token not found");
        return;
      }

      try {
        const response = await fetch(
          "https://safeway-hackers-466060604919.us-central1.run.app/api/v1/user",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.id) {
          setUserId(data.id);
          console.log("User data fetched:", data);
          
          // Set highest score from user data
          if (data.maxScore) {
            setHighestModule1Score(data.maxScore);
          }
          
          // Check if Module 2 should be unlocked based on completed levels
          if (data.completedLevels && data.completedLevels.includes(1)) {
            setModule2Unlocked(true);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, []);

  // Spawn first sign immediately when game starts
  useEffect(() => {
    if (gameStarted && !firstSignSpawned && !gameOver) {
      setFirstSignSpawned(true);
    }

    if (!gameStarted) {
      setFirstSignSpawned(false);
    }
  }, [gameStarted, firstSignSpawned, gameOver]);

  // Increase distance over time

  const handleModuleSelect = (module: string) => {
    setSelectedModule(module);
    setShowModuleSelection(false);
    handleStartGame();
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setGameSpeed(10); // Increased from 8 to 12
    setLastAnswerCorrect(null);
    setLastExplanation(null);
    toast("Drive safely! Watch for traffic signs!");
  };

  // Check if Module 2 should be unlocked
  useEffect(() => {
    if (selectedModule === "Module1" && score > highestModule1Score) {
      setHighestModule1Score(score);
      const maxScore = selectedModule === "GeneralTrafficRules" ? 20 : 48;
      const scorePercentage = (score / maxScore) * 100;

      // Unlock Module 2 if score is above 80%
      if (scorePercentage >= 80) {
        setModule2Unlocked(true);
        toast.success("Module 2 unlocked!");
      }
    }
  }, [score, selectedModule, highestModule1Score]);

  const handleGameOver = async () => {
    setGameOver(true);
    setShowModuleSelection(true); // Show module selection again
    toast.error("Game Over! Drive safely next time!");

    // Update highest score for Module 1
    if (selectedModule === "Module1" && score > highestModule1Score) {
      setHighestModule1Score(score);
      const maxScore = selectedModule === "GeneralTrafficRules" ? 20 : 48;
      const scorePercentage = (score / maxScore) * 100;

      // Unlock Module 2 if score is above 80%
      if (scorePercentage >= 80) {
        setModule2Unlocked(true);
        toast.success("Module 2 unlocked!");
      }
    }

    // Submit score and feedback to the API
    try {
      if (finalAnswers && finalAnswers.length > 0) {
        // Use different ssId and level based on the selected module
        const level = selectedModule === "Module1" ? 1 : 2;
        await quizAppi.submitScoreFeedback(
          score,
          finalAnswers,
          ssId,
          level,
          userId || undefined
        );
        console.log("Score and feedback submitted successfully");
      } else {
        console.warn("No answers to submit");
      }
    } catch (error) {
      console.error("Failed to submit score and feedback:", error);
    }
  };

  console.log("finalAnswers", finalAnswers);

  const handleAnswerQuestion = (
    correct: boolean,
    question: Question,
    questionScore: string
  ) => {
    console.log("questionScore", questionScore);
    // Question is no longer active
    setQuestionActive(false);

    if (correct) {
      setScore((prev) => prev + Number(questionScore));
      setLastAnswerCorrect(true);
      toast.success("Correct decision!");
    } else {
      setLives((prev) => prev - 1);
      setLastAnswerCorrect(false);
      toast.error("Incorrect decision!");

      if (lives <= 1) {
        handleGameOver();
      }
    }

    // Find the matching question in our array to get the explanation
    if (question.explanation) {
      setLastExplanation(question.explanation);
    }
    // Clear explanation after 5 seconds
    setTimeout(() => {
      setLastAnswerCorrect(null);
      setLastExplanation(null);
    }, 5000);
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[#0f172a] text-white font-nunito pt-20 pb-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b] z-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMzBtLTI4IDBhMjggMjggMCAxIDAgNTYgMCAyOCAyOCAwIDEgMC01NiAweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjIyZjQzIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] opacity-10 z-0"></div>

        {/* Decorative road line and car animation only shown when game is not started */}
        {(!gameStarted || gameOver) && (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-black z-10">
              <div className="road-dash h-2 absolute top-3 left-0 right-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyIj48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]"></div>
            </div>

            <motion.div
              className="absolute bottom-4 z-20"
              initial={{ x: -100 }}
              animate={{ x: "100vw" }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <img src={carImage} alt="Car" className="h-20" />
            </motion.div>
          </>
        )}

        <Header />

        <main className="w-full mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
          {/* game over condition */}

          {!gameStarted || gameOver ? (
            <AnimatedTransition animation="scale">
              <div className="relative glass-card p-8 md:p-10 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/10 border border-white/20 mx-auto">
                {/* Smaller Toggle Button Positioned in Top Right */}
                <div className="absolute top-4 right-4">
                  <div
                    onClick={() =>
                      setLanguage(language === "ENGLISH" ? "HINDI" : "ENGLISH")
                    }
                    className="relative w-24 h-7 cursor-pointer rounded-full bg-white flex items-center transition duration-300 ease-in-out shadow-md px-1"
                  >
                    {/* Language Text Inside Toggle */}
                    <span
                      className={`absolute uppercase text-xs font-semibold transition-all duration-300 ease-in-out ${
                        language === "ENGLISH"
                          ? "left-7 text-[#0f172a]"
                          : "right-8 text-[#22c55e]"
                      }`}
                    >
                      {language}
                    </span>

                    {/* Sliding Toggle Circle */}
                    <div
                      className={`absolute w-5 h-5 rounded-full bg-[#22c55e] transition-all duration-300 ease-in-out shadow-lg ${
                        language === "ENGLISH"
                          ? "left-1"
                          : "left-[calc(100%-1.75rem)] bg-[#0f172a]"
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-center text-center mt-6">
                  <div className="w-20 h-20 bg-[#22c55e]/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                    {gameOver ? (
                      <Trophy className="h-8 w-8 text-[#22c55e]" />
                    ) : (
                      <Car className="h-8 w-8 text-[#22c55e]" />
                    )}
                  </div>

                  <h2 className="text-4xl font-fredoka mb-3 text-white">
                    {gameOver ? "Game Over!" : "Traffic Safety Quiz"}
                  </h2>

                  {gameOver ? (
                    <p className="text-gray-300 mb-8 text-lg">
                      You scored {score} points!
                    </p>
                  ) : (
                    <p className="text-gray-300 mb-6">
                      Navigate through traffic and answer questions about road
                      safety!
                    </p>
                  )}

                  <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                    <button
                      onClick={() => handleModuleSelect("Module1")}
                      className="bg-[#22c55e] hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-[#22c55e]/20"
                    >
                      Beginner
                    </button>
                    {language !== "HINDI" ? (
                      <button
                        onClick={() =>
                          handleModuleSelect("GeneralTrafficRules")
                        }
                        disabled={!module2Unlocked}
                        className={`bg-[#22c55e] hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-[#22c55e]/20 ${
                          !module2Unlocked
                            ? "opacity-50 cursor-not-allowed hover:scale-100"
                            : ""
                        }`}
                      >
                        Advanced
                        {!module2Unlocked && ` (score 80% to unlock)`}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </AnimatedTransition>
          ) : (
            <>
              {/* Game stats */}
              <AnimatedTransition animation="fade">
                <div className="mb-6 grid grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
                  <div className="glass-card px-20 py-2 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg">
                    <div className="flex flex-col items-center">
                      <Zap className="h-6 w-6 text-amber-500 mb-2" />
                      <p className="text-sm text-gray-300 mb-1">SCORE</p>
                      <p className="font-bold text-xl">{score}</p>
                    </div>
                  </div>

                  <div className="glass-card py-2 px-20 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg">
                    <div className="flex flex-col items-center">
                      <Heart className="h-6 w-6 text-red-500 mb-2" />
                      <p className="text-sm text-gray-300 mb-1">LIVES</p>
                      <div className="flex">
                        {Array.from({ length: lives }).map((_, i) => (
                          <Heart
                            key={i}
                            className="h-5 w-5 text-red-500 fill-red-500 mr-1"
                          />
                        ))}
                        {Array.from({ length: 3 - lives }).map((_, i) => (
                          <Heart
                            key={i + lives}
                            className="h-5 w-5 text-red-200 mr-1"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedTransition>

              {/* Game area */}
              <AnimatedTransition
                animation="scale"
                className="w-full flex items-center justify-center"
              >
                <div className="relative w-full md:w-[60%]">
                  <div className="glass-card p-6 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 mb-4 shadow-xl">
                    <RoadGameComponent
                      onAnswerQuestion={handleAnswerQuestion}
                      gameSpeed={gameSpeed}
                      paused={gameOver}
                      onQuestionShow={() => setQuestionActive(true)}
                      setFinalAnswers={setFinalAnswers}
                      module={selectedModule}
                      setssId={setssId}
                      language={language}
                    />
                  </div>
                </div>
              </AnimatedTransition>
            </>
          )}
        </main>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0 }}>
        <ProctoringSystem onStatusChange={setIsProctoringEnabled} />
      </div>
    </>
  );
};

export default Quiz;
