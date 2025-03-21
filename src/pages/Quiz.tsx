import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Heart, Zap, Trophy, Car } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedTransition from '@/components/AnimatedTransition';
import RoadGameComponent from '@/components/RoadGameComponent';

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
const trafficQuestions: Question[] = [
  {
    text: 'What should you do when you see a STOP sign?',
    options: [
      { text: 'Come to a complete stop and check for traffic.', correct: true },
      {
        text: 'Slow down and keep moving if the road looks clear.',
        correct: false
      },
      { text: 'Honk and drive through quickly.', correct: false },
      { text: "Ignore it if you're in a hurry.", correct: false }
    ],
    explanation:
      'Always come to a complete stop at a stop sign and check for traffic before proceeding.'
  },
  {
    text: 'What should you do when approaching a yellow traffic light?',
    options: [
      {
        text: 'Speed up to make it through before it turns red.',
        correct: false
      },
      {
        text: "Slow down and prepare to stop if it's safe to do so.",
        correct: true
      },
      { text: 'Stop immediately regardless of your position.', correct: false },
      {
        text: "Honk to alert other drivers you're going through.",
        correct: false
      }
    ],
    explanation:
      "Yellow lights indicate you should slow down and prepare to stop if it's safe. If you're too close to stop safely, proceed with caution."
  },
  {
    text: 'What should you do when you see a pedestrian waiting to cross?',
    options: [
      { text: 'Speed up to pass before they start crossing.', correct: false },
      {
        text: 'Continue at your current speed - pedestrians should wait for cars.',
        correct: false
      },
      {
        text: "Stop and yield to the pedestrian until they've crossed.",
        correct: true
      },
      { text: "Honk to let them know you're coming through.", correct: false }
    ],
    explanation:
      "Always yield to pedestrians at crosswalks. It's not only courteous but also the law. Wait until they've completely crossed before proceeding."
  },
  {
    text: 'What should you do in a school zone during school hours?',
    options: [
      { text: 'Drive at the regular speed limit.', correct: false },
      { text: 'Slow down to the school zone speed limit.', correct: true },
      {
        text: 'Drive at any speed as long as there are no children visible.',
        correct: false
      },
      { text: 'Speed up to get through the zone quickly.', correct: false }
    ],
    explanation:
      'Always reduce your speed to the posted school zone limit during designated hours, regardless of whether children are visible.'
  },
  {
    text: 'What should you do when an ambulance with sirens is approaching from behind?',
    options: [
      { text: 'Speed up to get out of the way.', correct: false },
      { text: 'Continue driving normally.', correct: false },
      {
        text: 'Pull over to the right side of the road and stop.',
        correct: true
      },
      { text: 'Change lanes but maintain your speed.', correct: false }
    ],
    explanation:
      'When an emergency vehicle is approaching with lights and sirens, you must pull over to the right side of the road when safe and come to a complete stop.'
  }
];

const Quiz: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [distance, setDistance] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(10); // Increased from 8 to 12
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(
    null
  );
  const [lastExplanation, setLastExplanation] = useState<string | null>(null);
  const [questionActive, setQuestionActive] = useState(false);
  const [firstSignSpawned, setFirstSignSpawned] = useState(false);

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
  useEffect(() => {
    if (!gameStarted || gameOver || questionActive) return; // Pause distance counter when question is active

    const distanceInterval = setInterval(() => {
      setDistance((prev) => prev + 1);

      // Increase speed more quickly over time
      if (distance > 0 && distance % 200 === 0) {
        // Reduced from 300 to 200
        setGameSpeed((prev) => Math.min(prev + 3, 25)); // Increased increment from 2 to 3, max from 20 to 25
        toast.info('Speed increasing! Stay alert!');
      }
    }, 100);

    return () => clearInterval(distanceInterval);
  }, [gameStarted, gameOver, distance, questionActive]);

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setDistance(0);
    setLives(3);
    setGameSpeed(10); // Increased from 8 to 12
    setLastAnswerCorrect(null);
    setLastExplanation(null);
    toast('Drive safely! Watch for traffic signs!');
  };

  const handleGameOver = () => {
    setGameOver(true);
    toast.error('Game Over! Drive safely next time!');
  };

  const handleAnswerQuestion = (correct: boolean, question: Question) => {
    // Question is no longer active
    setQuestionActive(false);

    if (correct) {
      setScore((prev) => prev + 100);
      setLastAnswerCorrect(true);
      toast.success('Correct decision!');
    } else {
      setLives((prev) => prev - 1);
      setLastAnswerCorrect(false);
      toast.error('Incorrect decision!');

      if (lives <= 1) {
        handleGameOver();
      }
    }

    // Find the matching question in our array to get the explanation
    const matchedQuestion = trafficQuestions.find(
      (q) => q.text === question.text
    );
    if (matchedQuestion) {
      setLastExplanation(matchedQuestion.explanation);
    }

    // Clear explanation after 5 seconds
    setTimeout(() => {
      setLastAnswerCorrect(null);
      setLastExplanation(null);
    }, 5000);
  };

  return (
    <div className='min-h-screen w-full bg-background pt-20 pb-16'>
      <Header />

      <main className='container max-w-7xl mx-auto px-4'>
        {!gameStarted || gameOver ? (
          <AnimatedTransition animation='scale'>
            <Card glass>
              <div className='flex flex-col items-center text-center'>
                <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4'>
                  {gameOver ? (
                    <Trophy className='h-8 w-8 text-primary' />
                  ) : (
                    <Car className='h-8 w-8 text-primary' />
                  )}
                </div>

                <h2 className='text-2xl font-bold mb-2'>
                  {gameOver ? 'Game Over!' : 'Traffic Safety Quiz'}
                </h2>

                {gameOver ? (
                  <>
                    <p className='text-muted-foreground mb-6'>
                      You scored {score} points and traveled {distance} meters!
                    </p>
                    <div className='text-3xl font-bold mb-8'>
                      {Math.round((score / (distance * 2)) * 100)}% Rating
                    </div>
                  </>
                ) : (
                  <p className='text-muted-foreground mb-6'>
                    Navigate through traffic and answer questions about road
                    safety!
                  </p>
                )}

                <Button onClick={handleStartGame}>
                  {gameOver ? 'Drive Again' : 'Start Driving'}
                </Button>
              </div>
            </Card>
          </AnimatedTransition>
        ) : (
          <>
            {/* Game stats */}
            <AnimatedTransition animation='fade'>
              <div className='mb-6 grid grid-cols-3 gap-4'>
                <Card glass className='py-3'>
                  <div className='flex flex-col items-center'>
                    <Zap className='h-5 w-5 text-amber-500 mb-1' />
                    <p className='text-xs text-muted-foreground'>SCORE</p>
                    <p className='font-bold'>{score}</p>
                  </div>
                </Card>

                <Card glass className='py-3'>
                  <div className='flex flex-col items-center'>
                    <Car className='h-5 w-5 text-primary mb-1' />
                    <p className='text-xs text-muted-foreground'>DISTANCE</p>
                    <p className='font-bold'>{distance}m</p>
                  </div>
                </Card>

                <Card glass className='py-3'>
                  <div className='flex flex-col items-center'>
                    <Heart className='h-5 w-5 text-red-500 mb-1' />
                    <p className='text-xs text-muted-foreground'>LIVES</p>
                    <div className='flex'>
                      {Array.from({ length: lives }).map((_, i) => (
                        <Heart
                          key={i}
                          className='h-4 w-4 text-red-500 fill-red-500 mr-1'
                        />
                      ))}
                      {Array.from({ length: 3 - lives }).map((_, i) => (
                        <Heart
                          key={i + lives}
                          className='h-4 w-4 text-red-200 mr-1'
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </AnimatedTransition>

            {/* Game area */}
            <AnimatedTransition animation='scale'>
              <div className='relative'>
                <RoadGameComponent
                  onAnswerQuestion={handleAnswerQuestion}
                  questions={trafficQuestions}
                  gameSpeed={gameSpeed}
                  paused={gameOver}
                  onQuestionShow={() => setQuestionActive(true)}
                />

                {/* Feedback message */}
                {lastAnswerCorrect !== null && lastExplanation && (
                  <div
                    className={`mt-4 p-4 rounded-lg ${
                      lastAnswerCorrect
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-red-500/10 border border-red-500/30'
                    }`}
                  >
                    <p className='text-sm'>{lastExplanation}</p>
                  </div>
                )}
              </div>
            </AnimatedTransition>
          </>
        )}
      </main>
    </div>
  );
};

export default Quiz;
