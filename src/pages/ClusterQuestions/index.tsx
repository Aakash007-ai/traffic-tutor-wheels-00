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
import clusterImage from "./../../assets/images/cluster_image.png";

export const ClusterSignals = () => {
  const questions = useQuery({
    queryKey: ["clusterQuestions"],
    queryFn: () => quizAppi.getClusterQuestions(),
    select: (data) =>
      Object.values(data?.data?.initialQuestions)
        .map((q) => q as ApiQuestionData)
        .sort((a, b) => a.sequence - b.sequence),
    gcTime: 24 * 60 * 60 * 1000,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [shuffledQuestions, setShuffledQuestions] = useState<ApiQuestionData[]>(
    []
  );

  const shuffleQuestions = () => {
    if (questions.data) {
      const shuffled = [...questions.data].sort(() => Math.random() - 0.5);
      return shuffled;
    }
    return [];
  };

  const handleAnswer = (sequence: number) => {
    console.log(
      "hnadleAnswer -> sequence -> ",
      sequence,
      "\n",
      shuffledQuestions[currentQuestionIndex]
    );
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
      console.log(
        "Questions loaded successfully",
        JSON.stringify(questions.data)
      );
    }
  }, [questions.isLoading, questions.data, questions.isSuccess]);

  return (
    <div className="min-h-screen w-full bg-[#0f172a] pt-16 pb-16 flex flex-col items-center px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b] z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMzBtLTI4IDBhMjggMjggMCAxIDAgNTYgMCAyOCAyOCAwIDEgMC01NiAweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjIyZjQzIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] opacity-10 z-0"></div>
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('src/assets/images/cluster_image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      ></div>
      {/* <div
        className="min-h-screen w-full bg-background pt-16 pb-16 flex flex-col items-center px-4 sm:px-6 md:px-8"
        style={{
          backgroundImage: "url('src/assets/images/cluster_image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div> */}

      <Header />
      <main className="w-full max-w-4xl relative z-10">
        {/* Game stats */}
        <AnimatedTransition animation="fade">
          <div className="mb-6 grid grid-cols-2 gap-6 max-w-2xl mx-auto w-full mt-20">
            <div className="glass-card px-6 py-4 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg">
              <div className="flex flex-col items-center">
                <Zap className="h-6 w-6 text-amber-500 mb-2" />
                <p className="text-sm text-gray-300 mb-1">SCORE</p>
                <p className="font-bold text-xl text-white">{score}</p>
              </div>
            </div>

            <div className="glass-card py-4 px-6 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg">
              <div className="flex flex-col items-center">
                <Heart className="h-6 w-6 text-red-500 mb-2" />
                <p className="text-sm text-gray-300 mb-1">LIVES</p>
                <div className="flex">
                  {[...Array(lives)].map((_, i) => (
                    <Heart
                      key={i}
                      className="h-5 w-5 text-red-500 fill-red-500 mx-0.5"
                    />
                  ))}
                  {[...Array(3 - lives)].map((_, i) => (
                    <Heart
                      key={i + lives}
                      className="h-5 w-5 text-red-200 mx-0.5"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedTransition>

        {/* Question Display */}
        {lives > 0 ? (
          <AnimatedTransition animation="scale">
            <div className="glass-card p-6 mx-auto rounded-xl backdrop-blur-lg w-[600px] bg-white/10 border border-white/20 shadow-xl text-white">
              {shuffledQuestions.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-900/50 p-3 rounded-lg border border-blue-400/30 flex items-center justify-center">
                      <img
                        src={`src/assets/images/cluster/${shuffledQuestions?.[currentQuestionIndex]?.metadata?.imageFile}`}
                        alt="Warning"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      {shuffledQuestions?.[currentQuestionIndex]?.name}
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {shuffledQuestions?.[currentQuestionIndex]?.options?.map(
                      (option) => (
                        <OptionItem
                          key={option?.id}
                          option={option}
                          isSelected={selectedOption === option.sequence}
                          onSelect={() => handleAnswer(option.sequence)}
                        />
                      )
                    )}
                  </div>
                  {selectedOption !== null && (
                    <button
                      className="w-full py-3 bg-[#22c55e] text-white rounded-lg hover:bg-green-600 transition duration-200 mt-4 transform hover:scale-105 shadow-lg shadow-[#22c55e]/20"
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
          <AnimatedTransition animation="scale">
            <div className="relative glass-card p-8 md:p-10 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 mx-auto shadow-2xl text-center">
              <div className="w-20 h-20 bg-[#22c55e]/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Heart className="h-8 w-8 text-red-500" />
              </div>

              <h2 className="text-4xl font-bold mb-3 text-white">Game Over!</h2>
              <p className="text-gray-300 mb-8 text-lg">
                You scored{" "}
                <span className="text-[#22c55e] font-bold">{score}</span>{" "}
                points!
              </p>

              <button
                onClick={restartGame}
                className="bg-[#22c55e] hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-[#22c55e]/20"
              >
                Try Again
              </button>
            </div>
          </AnimatedTransition>
        )}
      </main>
    </div>
  );
};
