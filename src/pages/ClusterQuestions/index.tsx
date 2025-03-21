import AnimatedTransition from "@/components/AnimatedTransition"
import Card from "@/components/Card"
import { ApiQuestionData, Question } from "@/components/RoadGameComponent"
import { OptionItem } from "@/components/ui/quizModal/OptionItem"
import { quizAppi } from "@/services"
import { Header } from "@radix-ui/react-accordion"
import { useQuery } from "@tanstack/react-query"
import { Heart, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export const ClusterSignals = () => {
    const questions = useQuery({
      queryKey :["clusterQuestions"],
      queryFn : () => quizAppi.getQuestions(),
      select : (data) => Object.values(data?.data?.initialQuestions).map((q) => q as ApiQuestionData).sort((a, b) => a.sequence - b.sequence)
    })
  
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);

    const handleAnswer = (sequence: number) => {
        setSelectedOption(sequence);
        const correctAnswer = questions.data[currentQuestionIndex].metadata.ans;
        if (sequence.toString() === correctAnswer) {
            setScore(score + 1);
            toast.success("Correct!");
        } else {
            setLives(lives - 1);
            toast.error("Incorrect, try again.");
        }
    };

    const nextQuestion = () => {
        setSelectedOption(null);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    };

    useEffect(()=>{
      if(questions.isLoading){
        console.log("Loading questions...")
      }
      if(questions.isSuccess){
        console.log("Questions loaded successfully" ,JSON.stringify(questions.data))
      }
    },[questions.isLoading,questions.data,questions.isSuccess])

    return (
        <div className="min-h-screen w-full bg-background pt-20 pb-16">
                  {/* <Header /> */}
        <main className="container max-w-7xl mx-auto px-4">
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
            
            <AnimatedTransition animation="scale">
            <div className="relative">
                {questions.isSuccess && questions.data.length > 0 && (
                    <div>
                        <h2>{questions.data[currentQuestionIndex].name}</h2>
                        <div className="flex flex-col gap-2">
                            {questions.data[currentQuestionIndex].options.map((option, index) => (
                                <OptionItem
                                    key={option.id}
                                    option={option}
                                    isSelected={selectedOption === option.sequence}
                                    onSelect={() => handleAnswer(option.sequence)}
                                />
                            ))}
                        </div>
                        {selectedOption !== null && (
                            <button onClick={nextQuestion}>Next Question</button>
                        )}
                    </div>
                )}
            </div>
            </AnimatedTransition>
            </main>
        </div>
    )
}