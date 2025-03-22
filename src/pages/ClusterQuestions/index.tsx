import AnimatedTransition from "@/components/AnimatedTransition";
import Card from "@/components/Card";
import { OptionItem } from "@/components/ui/quizModal/OptionItem";
import { useQuery } from "@tanstack/react-query";
import { Heart, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import quizAppi from "@/services";
import { ApiQuestionData } from "@/components/RoadGameComponent";

export const ClusterSignals = () => {
    const questions = useQuery({
        queryKey: ["clusterQuestions"],
        queryFn: () => quizAppi.getClusterQuestions(),
        select: (data) => Object.values(data?.data?.initialQuestions).map((q) => q as ApiQuestionData).sort((a, b) => a.sequence - b.sequence),
        gcTime: 24 * 60 * 60 * 1000
    });

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [shuffledQuestions, setShuffledQuestions] = useState<ApiQuestionData[]>([]);

    const shuffleQuestions = () => {
        if (questions.data) {
            const shuffled = [...questions.data].sort(() => Math.random() - 0.5);
            return shuffled;
        }
        return [];
    };

    const handleAnswer = (sequence: number) => {
        console.log("hnadleAnswer -> sequence -> ", sequence ,"\n", shuffledQuestions[currentQuestionIndex])
        setSelectedOption(sequence);
        const correctAnswer = shuffledQuestions[currentQuestionIndex].metadata.ans;
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

    const restartGame = () => {
        setScore(0);
        setLives(3);
        setCurrentQuestionIndex(0);
        setShuffledQuestions(shuffleQuestions());
    };

    useEffect(() => {
        if (questions.isSuccess) {
            setShuffledQuestions(shuffleQuestions());
        }
    }, [questions.isSuccess]);

    useEffect(() => {
        if (questions.isLoading) {
            console.log("Loading questions...");
        }
        if (questions.isSuccess) {
            console.log("Questions loaded successfully", JSON.stringify(questions.data));
        }
    }, [questions.isLoading, questions.data, questions.isSuccess]);

    return (
        <div className="min-h-screen w-full bg-background pt-16 pb-16 flex flex-col items-center px-4 sm:px-6 md:px-8" style={{backgroundImage:"url('src/assets/images/cluster_image.png')" , backgroundSize: "cover", backgroundPosition: "center"}}>
            
            <Header />
            <main className="w-full max-w-4xl">
                {/* Game stats */}
                <AnimatedTransition animation="fade">
                    <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <Card glass className="py-4 flex flex-col items-center text-center">
                            <Zap className="h-6 w-6 text-amber-500 mb-2" />
                            <p className="text-sm text-muted-foreground">SCORE</p>
                            <p className="text-lg font-bold">{score}</p>
                        </Card>
                        <Card glass className="py-4 flex flex-col items-center text-center">
                            <Heart className="h-6 w-6 text-red-500 mb-2" />
                            <p className="text-sm text-muted-foreground">LIVES</p>
                            <div className="flex">
                                {[...Array(lives)].map((_, i) => (
                                    <Heart key={i} className="h-5 w-5 text-red-500 fill-red-500 mx-0.5" />
                                ))}
                                {[...Array(3 - lives)].map((_, i) => (
                                    <Heart key={i + lives} className="h-5 w-5 text-gray-300 mx-0.5" />
                                ))}
                            </div>
                        </Card>
                    </div>
                </AnimatedTransition>

                {/* Question Display */}
                {lives > 0 ? (
                    <AnimatedTransition animation="scale">
                        <div className="relative p-4 bg-white rounded-lg shadow-lg  " >
                            {shuffledQuestions.length > 0 && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                    <img src={`src/assets/images/cluster/${shuffledQuestions?.[currentQuestionIndex]?.metadata?.imageFile}`} alt="Warning" className="w-12 h-12 rounded-lg" />
                                        {/* <img src={`src/assets/images/cluster/${shuffledQuestions?.[currentQuestionIndex]?.metadata?.imageFile}`} alt="Warning" className="w-12 h-12 rounded-lg" /> */}
                                        <h2 className="text-lg font-semibold">{shuffledQuestions?.[currentQuestionIndex]?.name}</h2>
                                    </div>
                                    <div className="flex flex-col gap-3" >
                                        {shuffledQuestions?.[currentQuestionIndex]?.options?.map((option) => (
                                            <OptionItem
                                                key={option?.id}
                                                option={option}
                                                isSelected={selectedOption === option.sequence}
                                                onSelect={() => handleAnswer(option.sequence)}
                                            />
                                        ))}
                                    </div>
                                    {selectedOption !== null && (
                                        <button 
                                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200" 
                                            onClick={nextQuestion}
                                        >
                                            Next Question
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </AnimatedTransition>
                ) : (
                    <AnimatedTransition animation="fade">
                        <div className="text-center mt-6">
                            <h2 className="text-2xl font-bold text-red-500">Game Over</h2>
                            <p className="text-lg">Your final score is {score}.</p>
                            <button onClick={restartGame} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-300">Try Again</button>
                        </div>
                    </AnimatedTransition>
                )}
            </main>
        </div>
    );
};