import { useEffect, useRef, useState } from "react";
import { GameQuestion } from "../QuizController/QuizController";
import { OptionItem } from "../ui/quizModal/OptionItem";
import OneTimeSound from "@/assets/soundEffects/oneTimeSound";
import { toast } from "sonner";
import correctPedestrian from "./../../assets/signs/correctPedestrian.jpg";
import correctOneWay from "./../../assets/signs/compulsoryTurnLeft.png";
import correctStop from "./../../assets/signs/correctStop.png";

interface IOptionsPopUpProps {
  currentQuestion: GameQuestion;
  handleAnswer: (seqNumber: number) => void;
}

const OptionsPopUp: React.FC<IOptionsPopUpProps> = ({
  currentQuestion,
  handleAnswer,
}) => {
  const [questionTimer, setQuestionTimer] = useState<number>(30);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showingCorrectAnswer, setShowingCorrectAnswer] =
    useState<boolean>(false);

  const correctAnswerSequence = Number(currentQuestion.metadata.ans);
  const correctAnsRef = useRef(null);
  const wrongAnsRef = useRef(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentQuestion || selectedOption || showingCorrectAnswer) return;

    setQuestionTimer(30); // Reset timer
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setQuestionTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [currentQuestion, selectedOption, showingCorrectAnswer]);

  const handleTimeout = () => {
    const wrongAnswer = currentQuestion.options.find(
      (option) => option.sequence !== correctAnswerSequence
    );
    const correctOption = currentQuestion.options.find(
      (option) => option.sequence === correctAnswerSequence
    );

    toast.error(
      <div className="text-center flex items-center justify-center flex-col w-full gap-2">
        <div className="text-xl font-bold mb-2">⏰ Time's Up!</div>
        <div className="text-amber-600 font-medium">
          You need to be quicker next time!
        </div>
        <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
          <p className="font-semibold text-blue-800">The correct answer was:</p>
          <p className="mt-1 text-blue-700">{correctOption?.toolTip}</p>
        </div>
      </div>,
      {
        duration: 2000,
        className: "bg-amber-50 border-2 border-amber-300 p-4",
        position: "top-center",
      }
    );

    setSelectedOption(wrongAnswer?.sequence || null);
    setShowingCorrectAnswer(true);

    setTimeout(() => {
      handleAnswer(wrongAnswer?.sequence || -1);
    }, 2000);
  };

  const handleOptionSelect = (sequence: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    setQuestionTimer(0);
    setSelectedOption(sequence);

    const isCorrect = sequence === correctAnswerSequence;
    if (isCorrect) {
      toast.success(
        <div className="flex flex-col items-center justify-center gap-1 text-center w-full">
          <div className="text-xl font-bold mb-2">🎉 Excellent! 🎉</div>
          <div className="text-green-700 font-medium">
            You got it right! Great job!
          </div>
          <div className="mt-3 flex space-x-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <span
                  key={i}
                  className="animate-bounce inline-block"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  ⭐
                </span>
              ))}
          </div>
        </div>,
        {
          duration: 2000,
          className: "bg-green-50 border-2 border-green-500 p-4",
          position: "top-center",
        }
      );
      correctAnsRef.current?.playSoundOnce();
    } else {
      const correctOption = currentQuestion.options.find(
        (option) => option.sequence === correctAnswerSequence
      );
      wrongAnsRef.current?.playSoundOnce();
      console.log("correctOption", correctOption);

      toast.error(
        <div className="text-center flex items-center justify-center flex-col w-full gap-2">
          <div className="text-lg font-semibold mb-1">😕 Not Quite Right</div>
          <div className="text-red-600 mb-2">
            Don't worry, learning is a journey!
          </div>
          <div className="bg-blue-50 w-full p-2 rounded border border-blue-200 inline-block">
            <span className="text-blue-800 font-medium">
              The correct answer was:
            </span>
            <div className="text-blue-700 mt-1">{correctOption?.toolTip}</div>
          </div>
        </div>,
        {
          duration: 2000,
          className: "bg-white border border-red-300 shadow-lg",
          position: "top-center",
        }
      );
    }

    setShowingCorrectAnswer(true);
    setTimeout(() => {
      handleAnswer(sequence);
    }, 2000);
  };

  return (
    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-green-50/90 p-4 rounded-lg shadow-lg text-center max-w-md w-full z-20">
      <div className="flex justify-between items-center">
        <p className="text-xl font-medium text-green-900 mb-3">
          {currentQuestion?.name}
        </p>
        <div className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium text-green-900">
          {questionTimer > 0 ? `${questionTimer}s` : ""}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {currentQuestion.options.map((option) => (
          <OptionItem
            key={option.id}
            option={option}
            isSelected={selectedOption === option.sequence}
            isCorrect={
              showingCorrectAnswer && option.sequence === correctAnswerSequence
            }
            onSelect={() =>
              !selectedOption && handleOptionSelect(option.sequence)
            }
          />
        ))}
      </div>
      <OneTimeSound type="correct" ref={correctAnsRef} />
      <OneTimeSound type="error" ref={wrongAnsRef} />
    </div>
  );
};

export default OptionsPopUp;
