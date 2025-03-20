import React, { useState, useEffect } from 'react';
import { Car, CircleAlert, TrafficCone, ShieldCheck, ThumbsUp, Rotate3d, ListChecks, School, AlertTriangle, Users, MapPin, Navigation, ShieldQuestion } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import AnimatedTransition from '@/components/AnimatedTransition';
import { cn } from '@/lib/utils';

const trafficLessons = [
  {
    id: 1,
    title: "Intersection Rules",
    icon: <Navigation className="h-10 w-10" />,
    description: "Learn proper behavior at different types of intersections",
    color: "bg-blue-500",
    unlocked: true,
    scenarios: [
      {
        id: 101,
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
        id: 102,
        title: "Traffic Light Rules",
        description: "You're approaching a yellow traffic light. What's the correct action?",
        options: [
          "Speed up to make it through before it turns red",
          "Maintain speed and proceed through if close to the intersection",
          "Slow down and prepare to stop if it's safe to do so",
          "Stop immediately regardless of your position"
        ],
        correctOption: 2,
        explanation: "Yellow lights indicate you should slow down and prepare to stop if it's safe. If you're too close to stop safely, proceed with caution."
      }
    ]
  },
  {
    id: 2,
    title: "Pedestrian Safety",
    icon: <Users className="h-10 w-10" />,
    description: "Learn the rules for safely interacting with pedestrians",
    color: "bg-green-500",
    unlocked: true,
    scenarios: [
      {
        id: 201,
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
    ]
  },
  {
    id: 3,
    title: "School Zone",
    icon: <School className="h-10 w-10" />,
    description: "Learn special rules for school zones and school buses",
    color: "bg-yellow-500",
    unlocked: true,
    scenarios: [
      {
        id: 301,
        title: "School Zone Speed Limit",
        description: "You're driving through a school zone during school hours. What should you do?",
        options: [
          "Drive at the regular speed limit",
          "Slow down to the school zone speed limit",
          "Drive at any speed as long as there are no children visible",
          "Speed up to get through the zone quickly"
        ],
        correctOption: 1,
        explanation: "Always reduce your speed to the posted school zone limit during designated hours, regardless of whether children are visible."
      }
    ]
  },
  {
    id: 4,
    title: "Emergency Vehicles",
    icon: <AlertTriangle className="h-10 w-10" />,
    description: "Learn how to respond to emergency vehicles on the road",
    color: "bg-red-500",
    unlocked: false,
    scenarios: [
      {
        id: 401,
        title: "Emergency Vehicle Approaching",
        description: "An ambulance with sirens and lights is approaching from behind. What should you do?",
        options: [
          "Speed up to get out of the way",
          "Continue driving normally",
          "Pull over to the right side of the road and stop",
          "Change lanes but maintain your speed"
        ],
        correctOption: 2,
        explanation: "When an emergency vehicle is approaching with lights and sirens, you must pull over to the right side of the road when safe and come to a complete stop."
      }
    ]
  },
  {
    id: 5,
    title: "Highway Driving",
    icon: <MapPin className="h-10 w-10" />,
    description: "Master the rules for safe highway driving and merging",
    color: "bg-purple-500",
    unlocked: false,
    scenarios: []
  }
];

const Simulation = () => {
  const [viewMode, setViewMode] = useState<'lessons' | 'scenario'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [currentScenario, setCurrentScenario] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [carPosition, setCarPosition] = useState({ x: 50, y: 70 });
  const [carRotation, setCarRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);
  
  const lesson = selectedLesson !== null ? trafficLessons.find(l => l.id === selectedLesson) : null;
  const scenario = currentScenario !== null && lesson 
    ? lesson.scenarios.find(s => s.id === currentScenario) 
    : null;
  
  const handleLessonSelect = (lessonId: number) => {
    const lesson = trafficLessons.find(l => l.id === lessonId);
    if (lesson && lesson.unlocked) {
      setSelectedLesson(lessonId);
      setViewMode('scenario');
      
      // Select the first scenario by default
      if (lesson.scenarios.length > 0) {
        setCurrentScenario(lesson.scenarios[0].id);
        resetScenario();
      } else {
        toast.info("This lesson doesn't have any scenarios yet. Check back later!");
        setViewMode('lessons');
      }
    } else if (lesson && !lesson.unlocked) {
      toast.info("Complete previous lessons to unlock this one!");
    }
  };
  
  const resetScenario = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCarPosition({ x: 50, y: 70 });
    setCarRotation(0);
    setIsAnimating(false);
  };
  
  const handleScenarioSelect = (scenarioId: number) => {
    setCurrentScenario(scenarioId);
    resetScenario();
  };
  
  const handleOptionSelect = (option: number) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };
  
  const handleSubmit = () => {
    if (!scenario || selectedOption === null) {
      toast.error("Please select an option first");
      return;
    }
    
    setIsAnswered(true);
    
    if (selectedOption === scenario.correctOption) {
      toast.success("Correct decision!");
      // Add to completed scenarios if not already completed
      if (!completedScenarios.includes(scenario.id)) {
        setCompletedScenarios([...completedScenarios, scenario.id]);
      }
      
      // Animate the car for correct answer
      setIsAnimating(true);
      
      if (scenario.id === 101) { // Four-way stop animation
        setTimeout(() => {
          setCarPosition({ x: 50, y: 20 });
        }, 500);
      } else if (scenario.id === 201) { // Pedestrian crossing animation
        setTimeout(() => {
          setCarPosition({ x: 50, y: 40 });
        }, 1500);
        setTimeout(() => {
          setCarPosition({ x: 50, y: 20 });
        }, 3000);
      } else if (scenario.id === 301) { // School zone animation
        setTimeout(() => {
          setCarPosition({ x: 50, y: 40 });
        }, 500);
        setTimeout(() => {
          setCarPosition({ x: 50, y: 20 });
        }, 2000);
      } else { // Default animation
        setTimeout(() => {
          setCarPosition({ x: 50, y: 20 });
        }, 1000);
      }
    } else {
      toast.error("That's not the safest choice!");
      // Show consequence animation
      setIsAnimating(true);
      
      if (scenario.id === 101) { // Car collision animation at intersection
        setTimeout(() => {
          setCarPosition({ x: 50, y: 40 });
          setCarRotation(45);
        }, 500);
      } else if (scenario.id === 201) { // Pedestrian near miss
        setTimeout(() => {
          setCarPosition({ x: 50, y: 40 });
          setCarRotation(-20);
        }, 500);
        setTimeout(() => {
          setCarRotation(0);
          setCarPosition({ x: 50, y: 20 });
        }, 1500);
      } else { // Default wrong answer animation
        setTimeout(() => {
          setCarPosition({ x: 50, y: 40 });
          setCarRotation(15);
        }, 500);
        setTimeout(() => {
          setCarRotation(-15);
        }, 800);
        setTimeout(() => {
          setCarRotation(0);
        }, 1100);
      }
    }
  };
  
  const handleNextScenario = () => {
    if (!lesson || currentScenario === null) return;
    
    const currentIndex = lesson.scenarios.findIndex(s => s.id === currentScenario);
    if (currentIndex < lesson.scenarios.length - 1) {
      handleScenarioSelect(lesson.scenarios[currentIndex + 1].id);
    } else {
      toast.success("You've completed all scenarios in this lesson!");
      setViewMode('lessons');
      setSelectedLesson(null);
    }
  };
  
  const handleReturnToLessons = () => {
    setViewMode('lessons');
    setSelectedLesson(null);
    setCurrentScenario(null);
  };
  
  const getScenarioVisuals = (scenarioId: number) => {
    switch (scenarioId) {
      case 101: // Four-way stop
        return (
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
            
            {/* Other cars */}
            <div className="absolute left-[25%] top-[25%] transform -translate-x-1/2 -translate-y-1/2">
              <Car className="h-8 w-8 text-red-400 rotate-45" />
            </div>
            <div className="absolute right-[25%] top-[25%] transform translate-x-1/2 -translate-y-1/2">
              <Car className="h-8 w-8 text-blue-400 -rotate-45" />
            </div>
            <div className="absolute left-[25%] bottom-[25%] transform -translate-x-1/2 translate-y-1/2">
              <Car className="h-8 w-8 text-green-400 rotate-[135deg]" />
            </div>
          </>
        );
      
      case 201: // Pedestrian crossing
        return (
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
            {isAnswered && selectedOption === scenario?.correctOption ? (
              <div className={`absolute left-[40%] top-[30%] transition-all duration-1500 ${isAnimating ? 'top-[70%]' : ''}`}>
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            ) : (
              <div className="absolute left-[40%] top-[30%]">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            )}
          </>
        );
      
      case 102: // Traffic Light Rules
        return (
          <>
            {/* Road visualization */}
            <div className="absolute left-0 right-0 top-1/2 h-16 bg-gray-300 transform -translate-y-1/2" />
            
            {/* Traffic light */}
            <div className="absolute left-1/2 top-[30%] transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-10 h-20 bg-black rounded-md flex flex-col items-center justify-around py-2">
                <div className="w-6 h-6 rounded-full bg-red-500"></div>
                <div className="w-6 h-6 rounded-full bg-yellow-400"></div>
                <div className="w-6 h-6 rounded-full bg-green-500 opacity-30"></div>
              </div>
            </div>
          </>
        );
      
      case 301: // School Zone
        return (
          <>
            {/* Road visualization */}
            <div className="absolute left-0 right-0 top-1/2 h-16 bg-gray-300 transform -translate-y-1/2" />
            
            {/* School zone sign */}
            <div className="absolute left-[30%] top-[30%] transform -translate-y-1/2">
              <div className="w-16 h-16 bg-yellow-300 rounded-lg flex items-center justify-center border-2 border-black">
                <School className="h-10 w-10 text-black" />
              </div>
            </div>
            
            {/* Speed limit sign */}
            <div className="absolute right-[30%] top-[30%] transform -translate-y-1/2">
              <div className="w-12 h-16 bg-white rounded-lg flex flex-col items-center justify-center border-2 border-red-500">
                <span className="text-black font-bold text-xs">SPEED</span>
                <span className="text-black font-bold text-lg">25</span>
              </div>
            </div>
            
            {/* Children */}
            <div className="absolute left-[40%] top-[30%]">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="absolute left-[45%] top-[25%]">
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </>
        );
      
      case 401: // Emergency Vehicle
        return (
          <>
            {/* Road visualization */}
            <div className="absolute left-0 right-0 top-1/2 h-16 bg-gray-300 transform -translate-y-1/2" />
            
            {/* Emergency vehicle */}
            <div className="absolute left-[50%] top-[85%] transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
              <div className="w-12 h-18 bg-white rounded-md relative">
                <div className="absolute top-0 left-0 right-0 h-4 bg-red-500 flex justify-center items-center">
                  <div className="w-6 h-2 bg-blue-500 animate-pulse"></div>
                </div>
                <div className="text-xs text-center mt-4 font-bold">AMBULANCE</div>
              </div>
            </div>
          </>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <ShieldQuestion className="h-12 w-12 text-primary/50" />
          </div>
        );
    }
  };
  
  // Calculate lesson completion percentage
  const getLessonCompletionPercentage = (lessonId: number) => {
    const lesson = trafficLessons.find(l => l.id === lessonId);
    if (!lesson || lesson.scenarios.length === 0) return 0;
    
    const completedInLesson = lesson.scenarios.filter(s => completedScenarios.includes(s.id)).length;
    return Math.round((completedInLesson / lesson.scenarios.length) * 100);
  };
  
  return (
    <div className="min-h-screen w-full bg-background pt-20 pb-16">
      <Header />
      
      <main className="container max-w-5xl mx-auto px-4">
        <AnimatedTransition animation="fade">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Driver's Education</h1>
            <p className="text-muted-foreground">
              Learn real-world driving scenarios through interactive simulations
            </p>
          </div>
        </AnimatedTransition>
        
        {viewMode === 'lessons' ? (
          <AnimatedTransition animation="scale">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trafficLessons.map(lesson => {
                const completionPercentage = getLessonCompletionPercentage(lesson.id);
                const isCompleted = completionPercentage === 100;
                
                return (
                  <Card 
                    key={lesson.id} 
                    glass 
                    className={cn(
                      "overflow-hidden cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
                      !lesson.unlocked && "opacity-50 pointer-events-none"
                    )}
                    onClick={() => handleLessonSelect(lesson.id)}
                  >
                    <div className={`w-full h-2 ${lesson.color}`}>
                      <div 
                        className="h-full bg-white/30"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                    <div className="p-6">
                      <div className={`w-16 h-16 rounded-full ${lesson.color} flex items-center justify-center mb-4`}>
                        {lesson.icon}
                      </div>
                      
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{lesson.title}</h3>
                        {isCompleted && (
                          <div className="bg-green-500/10 p-1 rounded-full">
                            <ShieldCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4">
                        {lesson.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <ListChecks className="h-3 w-3 mr-1" />
                          <span>{lesson.scenarios.length} scenarios</span>
                        </div>
                        
                        {!lesson.unlocked ? (
                          <div className="flex items-center text-xs text-amber-500">
                            <span className="mr-1">Locked</span>
                            <AlertTriangle className="h-3 w-3" />
                          </div>
                        ) : completionPercentage > 0 ? (
                          <div className="text-xs text-primary font-medium">
                            {completionPercentage}% complete
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            Not started
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </AnimatedTransition>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Simulation Viewer */}
            <AnimatedTransition animation="scale">
              <Card glass className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">
                    {scenario?.title}
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReturnToLessons}
                  >
                    ← Back to Lessons
                  </Button>
                </div>
                
                {/* Simulation visual */}
                <div className="relative bg-secondary/50 rounded-xl h-64 mb-4 overflow-hidden">
                  {scenario && getScenarioVisuals(scenario.id)}
                  
                  {/* Player Car */}
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
                  
                  {/* Result indicators */}
                  {isAnswered && (
                    <div className="absolute right-4 top-4">
                      {selectedOption === scenario?.correctOption ? (
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
                      <p className="text-sm text-muted-foreground">{scenario?.explanation}</p>
                    </div>
                  </AnimatedTransition>
                )}
                
                <div className="mt-auto flex justify-between">
                  <Button variant="outline" onClick={resetScenario}>
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
                <p className="text-muted-foreground text-sm mb-6">{scenario?.description}</p>
                
                {scenario && (
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
                )}
                
                {!isAnswered && scenario && (
                  <Button 
                    className="w-full" 
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                  >
                    Submit Decision
                  </Button>
                )}
                
                {/* Lesson navigation */}
                {lesson && lesson.scenarios.length > 1 && (
                  <div className="mt-8 border-t pt-4">
                    <h3 className="text-sm font-medium mb-3">Lesson Scenarios</h3>
                    <div className="flex flex-wrap gap-2">
                      {lesson.scenarios.map((s, index) => (
                        <Button
                          key={s.id}
                          variant={currentScenario === s.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleScenarioSelect(s.id)}
                          className={cn(
                            completedScenarios.includes(s.id) && currentScenario !== s.id && "bg-green-500/10 text-green-700 border-green-300"
                          )}
                        >
                          {index + 1}
                          {completedScenarios.includes(s.id) && (
                            <ShieldCheck className="h-3 w-3 ml-1 text-green-500" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Rotate3d className="h-4 w-4" />
                    <span>Virtual driving simulator</span>
                  </div>
                </div>
              </Card>
            </AnimatedTransition>
          </div>
        )}
      </main>
    </div>
  );
};

export default Simulation;
