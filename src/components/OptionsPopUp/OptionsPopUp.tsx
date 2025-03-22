import { GameQuestion } from "../QuizController/QuizController";
import { OptionItem } from "../ui/quizModal/OptionItem";

interface IOptionsPopUpProps {
    currentQuestion: GameQuestion;
    handleAnswer: (seqNumber) => void;
}

const OptionsPopUp: React.FC<IOptionsPopUpProps> = ({currentQuestion, handleAnswer}) => {
    return(
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-green-50/90 p-4 rounded-lg shadow-lg text-center max-w-md w-full z-20">
                            <div className="flex justify-between items-center ">
                                <p className="text-xl font-medium text-green-900 mb-3">
                                    {currentQuestion?.name}
                                </p>
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