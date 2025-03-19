
import React, { useState, useEffect } from 'react';
import { Car, CircleAlert, TrafficCone, ShieldCheck, ThumbsUp, Rotate3d } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import AnimatedTransition from '@/components/AnimatedTransition';

// Simulation scenarios
const scenarios = [
  {
    id: 1,
    title: "Four-Way Stop Intersection",
    description: "You've arrived at a four-way stop intersection. There are cars at each stop sign. What do you do?",
    options: [
      "Go first since you're the best driver",
      "Wait your turn - the car that arrived first goes first",
      "Larger vehicles always have the right of way",
      "Honk to assert dominance"
    ],
    correctOption: 1,
    explanation: "At a four-way stop, vehicles proceed in the order they arrived. If two vehicles arrive at the same time, the vehicle on the right has the right of way."
  },
  {
    id: 2,
    title: "Pedestrian Crossing",
    description: "You're approaching a crosswalk and notice a pedestrian waiting to cross. What's the correct action?",
    options: [
      "Speed up to pass before they start crossing",
      "Continue at your current speed - pedestrians should wait for cars",
      "Stop and wave them across, then proceed",
      "Stop and yield to the pedestrian until they've crossed"
    ],
    correctOption: 3,
    explanation: "Always yield to pedestrians at crosswalks. It's not only courteous but also the law. Wait until they've completely crossed before proceeding."
  }
];

const Simulation = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [carPosition, setCarPosition] = useState({ x: 50, y: 70 });
  const [carRotation, setCarRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const scenario = scenarios[currentScenario];
  
  useEffect(() => {
    // Reset car position when scenario changes
    setCarPosition({ x: 50, y: 70 });
    setCarRotation(0);
    setIsAnimating(false);
  }, [currentScenario]);
  
  const handleOptionSelect = (option: number) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };
  
  const handleSubmit = () => {
    if (selectedOption === null) {
      toast.error("Please select an option first");
      return;
    }
    
    setIsAnswered(true);
    
    if (selectedOption === scenario.correctOption) {
      toast.success("Correct decision!");
      // Animate the car for correct answer
      setIsAnimating(true);
      
      if (currentScenario === 0) {
        // Four-way stop animation
        setTimeout(() => {
          setCarPosition({ x: 50, y: 20 });
        }, 500);
      } else if (currentScenario === 1) {
        // Pedestrian crossing animation - wait then go
        setTimeout(() => {
          setCarPosition({ x: 50, y: 40 });
        }, 1500);
        setTimeout(() => {
          setCarPosition({ x: 50, y: 20 });
        }, 3000);
      }
    } else {
      toast.error("That's not the safest choice!");
      // Show consequence animation
      setIsAnimating(true);
      
      if (currentScenario === 0) {
        // Car collision animation
        setTimeout(() => {
          setCarPosition({ x: 50, y: 40 });
          setCarRotation(45);
        }, 500);
      } else if (currentScenario === 1) {
        // Near miss animation
        setTimeout(() => {
          setCarPosition({ x: 50, y: 40 });
          setCarRotation(-20);
        }, 500);
        setTimeout(() => {
          setCarRotation(0);
          setCarPosition({ x: 50, y: 20 });
        }, 1500);
      }
    }
  };
  
  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      toast.success("You've completed all current simulation scenarios!");
    }
  };
  
  const handleRestart = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCarPosition({ x: 50, y: 70 });
    setCarRotation(0);
    setIsAnimating(false);
  };
  
  return (
    <div className="min-h-screen w-full bg-background pt-20 pb-16">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4">
        <AnimatedTransition animation="fade">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Driving Simulation</h1>
            <p className="text-muted-foreground">
              Practice making safe driving decisions in various scenarios
            </p>
          </div>
        </AnimatedTransition>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Simulation Viewer */}
          <AnimatedTransition animation="scale">
            <Card glass className="flex flex-col">
              <h2 className="text-xl font-medium mb-4">
                Scenario {currentScenario + 1}: {scenario.title}
              </h2>
              
              {/* Simulation visual */}
              <div className="relative bg-secondary/50 rounded-xl h-64 mb-4 overflow-hidden">
                <div 
                  className={`absolute transition-all duration-1000 ease-in-out`}
                  style={{
                    left: `${carPosition.x}%`,
                    top: `${carPosition.y}%`,
                    transform: `translate(-50%, -50%) rotate(${carRotation}deg)`,
                  }}
                >
                  <Car className="h-12 w-12 text-primary" />
                </div>
                
                {currentScenario === 0 && (
                  <>
                    {/* Intersection visualization */}
                    <div className="absolute left-0 right-0 top-1/2 h-4 bg-gray-300 transform -translate-y-1/2" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-gray-300 transform -translate-x-1/2" />
                    
                    {/* Stop signs */}
                    <div className="absolute left-1/2 top-[25%] transform -translate-x-1/2 -translate-y-1/2">
                      <TrafficCone className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="absolute left-1/2 bottom-[25%] transform -translate-x-1/2 translate-y-1/2">
                      <TrafficCone className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="absolute left-[25%] top-1/2 transform -translate-y-1/2">
                      <TrafficCone className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="absolute right-[25%] top-1/2 transform -translate-y-1/2">
                      <TrafficCone className="h-6 w-6 text-red-500" />
                    </div>
                  </>
                )}
                
                {currentScenario === 1 && (
                  <>
                    {/* Road visualization */}
                    <div className="absolute left-0 right-0 top-1/2 h-16 bg-gray-300 transform -translate-y-1/2" />
                    
                    {/* Pedestrian crossing */}
                    <div className="absolute left-[30%] right-[30%] top-1/2 h-16 bg-gray-300 transform -translate-y-1/2">
                      <div className="h-full w-full flex flex-col justify-center">
                        <div className="h-2 bg-white mb-2" />
                        <div className="h-2 bg-white mb-2" />
                        <div className="h-2 bg-white mb-2" />
                        <div className="h-2 bg-white" />
                      </div>
                    </div>
                    
                    {/* Pedestrian */}
                    {isAnswered && selectedOption === scenario.correctOption ? (
                      <div className={`absolute left-[40%] top-[30%] transition-all duration-1500 ${isAnimating ? 'top-[70%]' : ''}`}>
                        <div className="h-4 w-4 rounded-full bg-blue-500" />
                      </div>
                    ) : (
                      <div className="absolute left-[40%] top-[30%]">
                        <div className="h-4 w-4 rounded-full bg-blue-500" />
                      </div>
                    )}
                  </>
                )}
                
                {/* Result indicators */}
                {isAnswered && (
                  <div className="absolute right-4 top-4">
                    {selectedOption === scenario.correctOption ? (
                      <div className="bg-green-500/20 p-2 rounded-full">
                        <ThumbsUp className="h-6 w-6 text-green-500" />
                      </div>
                    ) : (
                      <div className="bg-red-500/20 p-2 rounded-full">
                        <CircleAlert className="h-6 w-6 text-red-500" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {isAnswered && (
                <AnimatedTransition animation="slide-up">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                    <p className="text-sm text-muted-foreground">{scenario.explanation}</p>
                  </div>
                </AnimatedTransition>
              )}
              
              <div className="mt-auto flex justify-between">
                <Button variant="outline" onClick={handleRestart}>
                  Restart
                </Button>
                {isAnswered && (
                  <Button onClick={handleNextScenario}>
                    Next Scenario
                  </Button>
                )}
              </div>
            </Card>
          </AnimatedTransition>
          
          {/* Decision Controls */}
          <AnimatedTransition animation="scale" delay={200}>
            <Card glass>
              <h2 className="text-xl font-medium mb-2">What would you do?</h2>
              <p className="text-muted-foreground text-sm mb-6">{scenario.description}</p>
              
              <div className="space-y-3 mb-8">
                {scenario.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedOption === index 
                        ? isAnswered 
                          ? index === scenario.correctOption 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-red-500/10 border-red-500/30'
                          : 'bg-primary/10 border-primary/30' 
                        : 'hover:bg-secondary border-border'
                    }`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {isAnswered && index === scenario.correctOption && (
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                      )}
                      {isAnswered && selectedOption === index && index !== scenario.correctOption && (
                        <CircleAlert className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {!isAnswered && (
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={selectedOption === null}
                >
                  Submit Decision
                </Button>
              )}
              
              <div className="mt-8 flex items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Rotate3d className="h-4 w-4" />
                  <span>Virtual driving simulation</span>
                </div>
              </div>
            </Card>
          </AnimatedTransition>
        </div>
      </main>
    </div>
  );
};

export default Simulation;
