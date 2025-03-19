
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, XCircle, Award } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import AnimatedTransition from '@/components/AnimatedTransition';

// Sample quiz questions
const quizQuestions = [
  {
    id: 1,
    question: "What does a red traffic light mean?",
    options: [
      "Speed up to get through the intersection",
      "Slow down and proceed with caution",
      "Stop completely until the light turns green",
      "Turn right if no cars are coming"
    ],
    correctAnswer: 2, // Index of the correct answer
    explanation: "A red traffic light means that you must come to a complete stop and wait until the light turns green before proceeding."
  },
  {
    id: 2,
    question: "When approaching a yield sign, what should you do?",
    options: [
      "Always come to a complete stop",
      "Slow down and be prepared to stop if necessary",
      "Maintain your speed, but honk your horn",
      "Accelerate to merge quickly into traffic"
    ],
    correctAnswer: 1,
    explanation: "A yield sign means you should slow down and be prepared to stop if necessary to let other traffic pass before proceeding."
  },
  {
    id: 3,
    question: "What is the purpose of a pedestrian crossing?",
    options: [
      "A designated area for pedestrians to cross the road safely",
      "An area where cars have the right of way over pedestrians",
      "A place where pedestrians can wait for a taxi",
      "A loading zone for delivery vehicles"
    ],
    correctAnswer: 0,
    explanation: "A pedestrian crossing (crosswalk) is a designated area where pedestrians have the right of way to cross the road safely."
  },
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
  };
  
  const handleCheckAnswer = () => {
    if (selectedOption === null) {
      toast.error("Please select an answer before checking");
      return;
    }
    
    setIsAnswered(true);
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
      toast.success("Correct answer!");
    } else {
      toast.error("Incorrect answer. Try again!");
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };
  
  return (
    <div className="min-h-screen w-full bg-background pt-20 pb-16">
      <Header />
      
      <main className="container max-w-3xl mx-auto px-4">
        {quizCompleted ? (
          <AnimatedTransition animation="scale">
            <Card glass>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
                <p className="text-muted-foreground mb-6">
                  You scored {correctAnswers} out of {quizQuestions.length} questions correctly.
                </p>
                <div className="text-3xl font-bold mb-8">
                  {Math.round((correctAnswers / quizQuestions.length) * 100)}%
                </div>
                <Button onClick={handleRestartQuiz}>
                  Take Quiz Again
                </Button>
              </div>
            </Card>
          </AnimatedTransition>
        ) : (
          <>
            {/* Quiz progress */}
            <AnimatedTransition animation="fade">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-muted-foreground text-sm">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </p>
                  <p className="text-sm font-medium">
                    Score: {correctAnswers}/{currentQuestionIndex + (isAnswered ? 1 : 0)}
                  </p>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentQuestionIndex + (isAnswered ? 1 : 0)) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            </AnimatedTransition>
            
            {/* Question card */}
            <AnimatedTransition animation="scale" key={currentQuestionIndex}>
              <Card glass>
                <h2 className="text-xl font-medium mb-6">{currentQuestion.question}</h2>
                
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedOption === index 
                          ? isAnswered 
                            ? index === currentQuestion.correctAnswer 
                              ? 'bg-green-500/10 border-green-500/30' 
                              : 'bg-red-500/10 border-red-500/30'
                            : 'bg-primary/10 border-primary/30' 
                          : 'hover:bg-secondary border-border'
                      }`}
                      onClick={() => handleOptionSelect(index)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {isAnswered && index === currentQuestion.correctAnswer && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        {isAnswered && selectedOption === index && index !== currentQuestion.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {isAnswered && (
                  <AnimatedTransition animation="slide-up">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                      <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                    </div>
                  </AnimatedTransition>
                )}
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevQuestion} 
                    disabled={currentQuestionIndex === 0}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" /> Previous
                  </Button>
                  
                  {isAnswered ? (
                    <Button onClick={handleNextQuestion} className="gap-2">
                      {currentQuestionIndex < quizQuestions.length - 1 ? (
                        <>Next <ArrowRight className="h-4 w-4" /></>
                      ) : (
                        'Finish Quiz'
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handleCheckAnswer}>
                      Check Answer
                    </Button>
                  )}
                </div>
              </Card>
            </AnimatedTransition>
          </>
        )}
      </main>
    </div>
  );
};

export default Quiz;
