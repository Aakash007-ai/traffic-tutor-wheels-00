import { useEffect, useState } from 'react';
import { GameQuestion } from '../QuizController/QuizController';
import { OptionItem } from '../ui/quizModal/OptionItem';
import { toast } from 'sonner';

interface IOptionsPopUpProps {
  currentQuestion: GameQuestion;
  handleAnswer: (seqNumber) => void;
}

const OptionsPopUp: React.FC<IOptionsPopUpProps> = ({
  currentQuestion,
  handleAnswer
}) => {
  const [questionTimer, setQuestionTimer] = useState<number>(20);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showingCorrectAnswer, setShowingCorrectAnswer] =
    useState<boolean>(false);

  // Get the correct answer sequence
  const correctAnswerSequence = Number(currentQuestion.metadata.ans);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;

    if (currentQuestion && !selectedOption && !showingCorrectAnswer) {
      // Reset timer to 20 seconds when question appears
      setQuestionTimer(20);

      // Start countdown
      timerInterval = setInterval(() => {
        setQuestionTimer((prevTime) => {
          const newTime = prevTime - 1;

          // If timer reaches 0, close popup and reduce life
          if (newTime <= 0) {
            // Clear the interval
            clearInterval(timerInterval);

            const wrongAnswer = currentQuestion.options.filter(
              (option) => option.sequence !== currentQuestion.metadata.ans
            )[0];

            // Find the correct option
            const correctOption = currentQuestion.options.find(
              (option) => option.sequence === correctAnswerSequence
            );

            // Show toast with correct answer
            toast.error(
              <div>
                <p>Time's up!</p>
                <p className='font-medium mt-1'>
                  The correct answer was: {correctOption?.toolTip}
                </p>
              </div>,
              {
                duration: 3000 // Show for 3 seconds
              }
            );

            // Show the wrong answer was selected and highlight the correct one
            setSelectedOption(wrongAnswer.sequence);
            setShowingCorrectAnswer(true);

            // Wait 2 seconds before closing
            setTimeout(() => {
              handleAnswer(wrongAnswer.sequence);
            }, 2000);
          }
          return newTime;
        });
      }, 1000);
    }

    // Clean up interval on component unmount or when popup closes
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [currentQuestion, handleAnswer, selectedOption, showingCorrectAnswer]);

  const handleOptionSelect = (sequence: number) => {
    // Clear any existing timers
    setQuestionTimer(0);

    // Set the selected option
    setSelectedOption(sequence);

    // Check if the answer is correct
    const isCorrect = sequence === correctAnswerSequence;

    if (isCorrect) {
      // If correct, show success toast and wait 2 seconds
      toast.success('Correct answer!');
      
      // Show the correct answer is selected
      setShowingCorrectAnswer(true);
      
      // Wait 2 seconds before closing
      setTimeout(() => {
        handleAnswer(sequence);
      }, 2000);
    } else {
      // If incorrect, find the correct option
      const correctOption = currentQuestion.options.find(
        (option) => option.sequence === correctAnswerSequence
      );

      // Show toast with correct answer
      toast.error(
        <div>
          <p>Wrong answer!</p>
          <p className='font-medium mt-1'>
            The correct answer was: {correctOption?.toolTip}
          </p>
        </div>,
        {
          duration: 3000 // Show for 3 seconds
        }
      );

      // Show the correct answer for 2 seconds
      setShowingCorrectAnswer(true);

      // Wait 2 seconds before closing
      setTimeout(() => {
        handleAnswer(sequence);
      }, 2000);
    }
  };

  return (
    <div className='absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-green-50/90 p-4 rounded-lg shadow-lg text-center max-w-md w-full z-20'>
      <div className='flex justify-between items-center '>
        <p className='text-xl font-medium text-green-900 mb-3'>
          {currentQuestion?.name}
        </p>
        <div className='bg-gray-200 px-3 py-1 rounded-full text-sm font-medium  text-green-900'>
          {questionTimer > 0 ? `${questionTimer}s` : ''}
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {currentQuestion.options.map((option) => (
          <OptionItem
            key={option.id}
            option={option}
            isSelected={selectedOption === option.sequence}
            isCorrect={showingCorrectAnswer && option.sequence === correctAnswerSequence}
            onSelect={() =>
              !selectedOption && handleOptionSelect(option.sequence)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default OptionsPopUp;
