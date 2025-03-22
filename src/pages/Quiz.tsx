import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Heart, Zap, Trophy, Car } from "lucide-react";
import { toast } from "sonner";
import AnimatedTransition from "@/components/AnimatedTransition";
import RoadGameComponent from "@/components/RoadGameComponent";
import { ProctoringSystem } from "@/components/Proctoring";
import quizAppi from "@/services";
// import { quizAppi } from "../services/index.js";

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
        const response = await fetch("http://192.168.26.248:8091/api/v1/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.id) {
          setUserId(data.id);
          console.log("User ID set:", data.id);
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

      // Unlock Module 2 if score is above 80%
      if (score >= 80) {
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

      // Unlock Module 2 if score is above 80%
      if (score >= 80) {
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
    <div className="min-h-screen w-full bg-background pt-20 pb-16">

     
      <Header />

      <main className="container max-w-7xl mx-auto px-4">
          {/* game over condition */}
        {!gameStarted || gameOver ? (
          <AnimatedTransition animation="scale">
            <Card glass>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  {gameOver ? (
                    <Trophy className="h-8 w-8 text-primary" />
                  ) : (
                    <Car className="h-8 w-8 text-primary" />
                  )}
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  {gameOver ? "Game Over!" : "Traffic Safety Quiz"}
                </h2>

                {gameOver ? (
                  <>
                    <p className="text-muted-foreground mb-6">
                      You scored {score} points!
                    </p>
                    {/* <div className="text-3xl font-bold mb-8">
                      {Math.round((score / (distance * 2)) * 100)}% Rating
                    </div> */}
                  </>
                ) : (
                  <p className="text-muted-foreground mb-6">
                    Navigate through traffic and answer questions about road
                    safety!
                  </p>
                )}

                {showModuleSelection ? (
                  <div className="flex flex-col gap-4 w-full max-w-xs">
                    <Button onClick={() => handleModuleSelect("Module1")}>
                      Module 1
                    </Button>
                    <Button
                      onClick={() => handleModuleSelect("GeneralTrafficRules")}
                      disabled={!module2Unlocked}
                      className={
                        !module2Unlocked ? "opacity-50 cursor-not-allowed" : ""
                      }
                    >
                      Module 2{" "}
                      {!module2Unlocked && `(Score 80% in Module 1 to unlock)`}
                    </Button>
                    {gameOver && highestModule1Score > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Highest Module 1 Score: {highestModule1Score}%
                      </p>
                    )}
                  </div>
                ) : (
                  <Button onClick={handleStartGame}>Start Driving</Button>
                )}
              </div>
            </Card>
          </AnimatedTransition>
        ) : (
          <>
            {/* Game stats */}
            <AnimatedTransition animation="fade">
              <div className="mb-6 grid grid-cols-3 gap-4">
                <Card glass className="py-3">
                  <div className="flex flex-col items-center">
                    <Zap className="h-5 w-5 text-amber-500 mb-1" />
                    <p className="text-xs text-muted-foreground">SCORE</p>
                    <p className="font-bold">{score}</p>
                  </div>
                </Card>

                <Card glass className="py-3">
                  <div className="flex flex-col items-center">
                    <Heart className="h-5 w-5 text-red-500 mb-1" />
                    <p className="text-xs text-muted-foreground">LIVES</p>
                    <div className="flex">
                      {Array.from({ length: lives }).map((_, i) => (
                        <Heart
                          key={i}
                          className="h-4 w-4 text-red-500 fill-red-500 mr-1"
                        />
                      ))}
                      {Array.from({ length: 3 - lives }).map((_, i) => (
                        <Heart
                          key={i + lives}
                          className="h-4 w-4 text-red-200 mr-1"
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </AnimatedTransition>

            {/* Game area */}
            <AnimatedTransition animation="scale">
              <div className="relative">
                <RoadGameComponent
                  onAnswerQuestion={handleAnswerQuestion}
                  gameSpeed={gameSpeed}
                  paused={gameOver}
                  onQuestionShow={() => setQuestionActive(true)}
                  setFinalAnswers={setFinalAnswers}
                  module={selectedModule}
                  setssId={setssId}
                />

                {/* Feedback message */}
                {lastAnswerCorrect !== null && lastExplanation && (
                  <div
                    className={`mt-4 p-4 rounded-lg ${
                      lastAnswerCorrect
                        ? "bg-green-500/10 border border-green-500/30"
                        : "bg-red-500/10 border border-red-500/30"
                    }`}
                  >
                    <p className="text-sm">{lastExplanation}</p>
                  </div>
                )}
              </div>
            </AnimatedTransition>
          </>
        )}
      </main>
    </div>

    <div style={{position: "absolute", bottom: 0, left: 0}}><ProctoringSystem onStatusChange={setIsProctoringEnabled} /></div></>
  );
};

export default Quiz;
