import { useEffect, useState } from "react";
import { GameQuestion } from "../QuizController/QuizController";
import { OptionItem } from "../ui/quizModal/OptionItem";

interface IOptionsPopUpProps {
  currentQuestion: GameQuestion;
  handleAnswer: (seqNumber) => void;
}

const OptionsPopUp: React.FC<IOptionsPopUpProps> = ({
  currentQuestion,

  handleAnswer,
}) => {
  const [questionTimer, setQuestionTimer] = useState<number>(20);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;

    if (currentQuestion) {
      // Reset timer to 20 seconds when question appears
      setQuestionTimer(20);

      // Start countdown
      timerInterval = setInterval(() => {
        setQuestionTimer((prevTime) => {
          const newTime = prevTime - 1;

          // If timer reaches 0, close popup and reduce life
          if (newTime <= 0) {
            // Clear the interval
            const wrongAnswer = currentQuestion.options.filter(
              (option) => option.sequence !== currentQuestion.metadata.ans
            )[0];
            handleAnswer(wrongAnswer.sequence);

            clearInterval(timerInterval);
          }
          return newTime;
        });
      }, 1000);
    }

    // Clean up interval on component unmount or when popup closes
    return () => {
      clearInterval(timerInterval);
    };
  }, [currentQuestion, handleAnswer]);
  return (
    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-green-50/90 p-4 rounded-lg shadow-lg text-center max-w-md w-full z-20">
      <div className="flex justify-between items-center ">
        <p className="text-xl font-medium text-green-900 mb-3">
          {currentQuestion?.name}
        </p>
        <div className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium  text-green-900">
          {questionTimer}s
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {currentQuestion.options.map((option, index) => (
          <OptionItem
            key={option.id}
            option={option}
            isSelected={false}
            onSelect={() => handleAnswer(option?.sequence)}
          />
        ))}
      </div>
    </div>
  );
};

export default OptionsPopUp;
