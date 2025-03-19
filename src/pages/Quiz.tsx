
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Car, Shield, Heart, Zap, Trophy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Progress } from '@/components/ui/progress';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useIsMobile } from '@/hooks/use-mobile';

// Traffic challenges - replacing quiz questions
const trafficChallenges = [
  {
    id: 1,
    situation: "Red traffic light ahead",
    correctAction: "stop",
    explanation: "Always stop at red traffic lights and wait until they turn green."
  },
  {
    id: 2,
    situation: "Pedestrian crossing the road",
    correctAction: "yield",
    explanation: "Always yield to pedestrians, especially at designated crosswalks."
  },
  {
    id: 3,
    situation: "School zone ahead",
    correctAction: "slow",
    explanation: "Reduce your speed in school zones to ensure the safety of children."
  },
  {
    id: 4,
    situation: "Ambulance with sirens behind you",
    correctAction: "pull_over",
    explanation: "Pull over to the side of the road when emergency vehicles need to pass."
  },
  {
    id: 5,
    situation: "Highway merging lane",
    correctAction: "accelerate",
    explanation: "When merging onto a highway, match the speed of traffic to merge safely."
  }
];

const TrafficGame = () => {
  const isMobile = useIsMobile();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentChallenge, setCurrentChallenge] = useState<number | null>(null);
  const [challengeVisible, setChallengeVisible] = useState(false);
  const [carPosition, setCarPosition] = useState(1); // 0: left, 1: center, 2: right
  const [obstaclePositions, setObstaclePositions] = useState<number[]>([]);
  const [roadSpeed, setRoadSpeed] = useState(5);
  const [challengeTimeout, setChallengeTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastChallengeTime, setLastChallengeTime] = useState(0);
  
  const gameLoopRef = useRef<number | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  // Start the game
  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setDistance(0);
    setLives(3);
    setCarPosition(1);
    setObstaclePositions([]);
    setRoadSpeed(5);
    setCurrentChallenge(null);
    setChallengeVisible(false);
    toast("Drive safely! Watch for traffic challenges!");
    
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    gameLoop();
  };
  
  // Game loop
  const gameLoop = () => {
    // Update game state
    setDistance(prev => prev + 1);
    
    // Increase speed slightly over time
    if (distance > 0 && distance % 500 === 0) {
      setRoadSpeed(prev => Math.min(prev + 1, 15));
      toast.info("Speed increasing! Stay alert!");
    }
    
    // Random chance to spawn a traffic challenge
    const now = Date.now();
    if (!challengeVisible && !currentChallenge && now - lastChallengeTime > 5000 && Math.random() < 0.01) {
      spawnChallenge();
    }
    
    // Random chance to spawn obstacle
    if (Math.random() < 0.02) {
      const randomLane = Math.floor(Math.random() * 3);
      setObstaclePositions(prev => [...prev, randomLane]);
      
      // Remove obstacles after they pass the screen
      setTimeout(() => {
        setObstaclePositions(prev => prev.slice(1));
      }, 3000);
    }
    
    // Continue the game loop if not game over
    if (!gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  };
  
  // Spawn a traffic challenge
  const spawnChallenge = () => {
    const randomIndex = Math.floor(Math.random() * trafficChallenges.length);
    setCurrentChallenge(randomIndex);
    setChallengeVisible(true);
    setLastChallengeTime(Date.now());
    
    // Set a timeout to penalize if the player doesn't respond
    const timeout = setTimeout(() => {
      if (challengeVisible) {
        handleChallengeResponse("none");
      }
    }, 6000);
    
    setChallengeTimeout(timeout);
  };
  
  // Handle player response to traffic challenge
  const handleChallengeResponse = (action: string) => {
    if (!currentChallenge || !challengeVisible) return;
    
    // Clear the challenge timeout
    if (challengeTimeout) {
      clearTimeout(challengeTimeout);
      setChallengeTimeout(null);
    }
    
    const challenge = trafficChallenges[currentChallenge];
    
    if (action === challenge.correctAction) {
      // Correct response
      toast.success("Correct decision!");
      setScore(prev => prev + 100);
    } else if (action === "none") {
      // No response
      toast.error("Too slow! Always be prepared for traffic situations.");
      setLives(prev => prev - 1);
    } else {
      // Incorrect response
      toast.error(`Incorrect! ${challenge.explanation}`);
      setLives(prev => prev - 1);
    }
    
    // Hide the challenge
    setChallengeVisible(false);
    setCurrentChallenge(null);
    
    // Check if game over
    if (lives <= 1 && action !== challenge.correctAction) {
      handleGameOver();
    }
  };
  
  // Handle game over
  const handleGameOver = () => {
    setGameOver(true);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    toast.error("Game Over! Drive safely next time!");
  };
  
  // Move car left or right
  const handleMoveLeft = () => {
    if (carPosition > 0) {
      setCarPosition(prev => prev - 1);
    }
  };
  
  const handleMoveRight = () => {
    if (carPosition < 2) {
      setCarPosition(prev => prev + 1);
    }
  };
  
  // Keyboard controls
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleMoveLeft();
      } else if (e.key === "ArrowRight") {
        handleMoveRight();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, gameOver, carPosition]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      if (challengeTimeout) {
        clearTimeout(challengeTimeout);
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen w-full bg-background pt-20 pb-16">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4">
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
                  {gameOver ? "Game Over!" : "Traffic Runner Challenge"}
                </h2>
                
                {gameOver ? (
                  <>
                    <p className="text-muted-foreground mb-6">
                      You scored {score} points and traveled {distance} meters!
                    </p>
                    <div className="text-3xl font-bold mb-8">
                      {Math.round((score / (distance * 2)) * 100)}% Rating
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground mb-6">
                    Drive safely through traffic, avoid obstacles, and respond to traffic challenges!
                  </p>
                )}
                
                <Button onClick={handleStartGame}>
                  {gameOver ? "Play Again" : "Start Driving"}
                </Button>
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
                    <Car className="h-5 w-5 text-primary mb-1" />
                    <p className="text-xs text-muted-foreground">DISTANCE</p>
                    <p className="font-bold">{distance}m</p>
                  </div>
                </Card>
                
                <Card glass className="py-3">
                  <div className="flex flex-col items-center">
                    <Heart className="h-5 w-5 text-red-500 mb-1" />
                    <p className="text-xs text-muted-foreground">LIVES</p>
                    <div className="flex">
                      {Array.from({ length: lives }).map((_, i) => (
                        <Heart key={i} className="h-4 w-4 text-red-500 fill-red-500 mr-1" />
                      ))}
                      {Array.from({ length: 3 - lives }).map((_, i) => (
                        <Heart key={i + lives} className="h-4 w-4 text-red-200 mr-1" />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </AnimatedTransition>
            
            {/* Game area */}
            <AnimatedTransition animation="scale">
              <div 
                className="glass-card rounded-2xl overflow-hidden mb-6 subtle-shadow"
                style={{ height: '500px', position: 'relative' }}
                ref={gameContainerRef}
              >
                {/* Road */}
                <div className="absolute inset-0 bg-gray-800 overflow-hidden">
                  {/* Road markings */}
                  <div className="absolute inset-0 flex">
                    <div className="w-1/3 h-full border-r-2 border-dashed border-white/30"></div>
                    <div className="w-1/3 h-full border-r-2 border-dashed border-white/30"></div>
                  </div>
                  
                  {/* Animated road stripes */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'linear-gradient(0deg, transparent 0%, transparent 70%, white 70%, white 100%)',
                      backgroundSize: '100% 80px',
                      backgroundPosition: '0 0',
                      animation: `roadMove ${16 - roadSpeed}s linear infinite`,
                      opacity: 0.2,
                    }}
                  />
                  
                  {/* Car */}
                  <div 
                    className="absolute bottom-16"
                    style={{
                      width: '40px',
                      height: '80px',
                      backgroundImage: 'radial-gradient(circle, #3982e4 0%, #2563eb 70%, #1d4ed8 100%)',
                      borderRadius: '10px',
                      left: `calc(${(carPosition * 33.33) + 16.67}% - 20px)`,
                      transition: 'left 0.2s ease-out',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
                    }}
                  >
                    <div className="absolute top-1 left-1 right-1 h-1/2 bg-blue-200/30 rounded-t-lg"></div>
                    <div className="absolute bottom-1 left-2 w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="absolute bottom-1 right-2 w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                  
                  {/* Obstacles */}
                  {obstaclePositions.map((lane, index) => (
                    <div 
                      key={index}
                      className="absolute w-12 h-12 bg-red-500 rounded-md"
                      style={{
                        left: `calc(${(lane * 33.33) + 16.67}% - 24px)`,
                        animation: `obstacleMove ${3}s linear forwards`,
                        boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
                      }}
                    >
                      <AlertCircle className="w-full h-full text-white p-2" />
                    </div>
                  ))}
                </div>
                
                {/* Traffic challenge popup */}
                {challengeVisible && currentChallenge !== null && (
                  <AnimatedTransition animation="slide-up">
                    <div className="absolute left-0 right-0 top-10 mx-auto w-4/5 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-blue-200 shadow-lg">
                      <div className="mb-2 text-center">
                        <Shield className="inline-block h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-bold text-blue-800">Traffic Challenge</span>
                      </div>
                      <p className="text-center font-medium mb-4">
                        {trafficChallenges[currentChallenge].situation}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleChallengeResponse("stop")}
                          className="bg-red-100 hover:bg-red-200 border-red-200"
                        >
                          Stop
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleChallengeResponse("yield")}
                          className="bg-amber-100 hover:bg-amber-200 border-amber-200"
                        >
                          Yield
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleChallengeResponse("slow")}
                          className="bg-yellow-100 hover:bg-yellow-200 border-yellow-200"
                        >
                          Slow Down
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleChallengeResponse("pull_over")}
                          className="bg-indigo-100 hover:bg-indigo-200 border-indigo-200"
                        >
                          Pull Over
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleChallengeResponse("accelerate")}
                          className="bg-green-100 hover:bg-green-200 border-green-200 col-span-2"
                        >
                          Accelerate
                        </Button>
                      </div>
                      
                      {/* Timer bar */}
                      <div className="mt-3">
                        <Progress 
                          value={100} 
                          className="h-1.5"
                          style={{
                            animation: 'timerShrink 6s linear forwards'
                          }}
                        />
                      </div>
                    </div>
                  </AnimatedTransition>
                )}
              </div>
            </AnimatedTransition>
            
            {/* Controls */}
            <AnimatedTransition animation="fade" delay={200}>
              <div className="flex justify-between">
                <Button
                  size={isMobile ? "lg" : "default"}
                  variant="outline"
                  onClick={handleMoveLeft}
                  className="flex-1 max-w-36"
                >
                  <ArrowLeft className="h-6 w-6" />
                  {!isMobile && <span className="ml-2">Left</span>}
                </Button>
                
                <Button
                  size={isMobile ? "lg" : "default"}
                  variant="outline"
                  onClick={handleMoveRight}
                  className="flex-1 max-w-36"
                >
                  {!isMobile && <span className="mr-2">Right</span>}
                  <ArrowRight className="h-6 w-6" />
                </Button>
              </div>
            </AnimatedTransition>
          </>
        )}
      </main>
      
      {/* CSS animations */}
      <style jsx global>{`
        @keyframes roadMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 800px; }
        }
        
        @keyframes obstacleMove {
          0% { top: -48px; }
          100% { top: 100%; }
        }
        
        @keyframes timerShrink {
          0% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

export default TrafficGame;
