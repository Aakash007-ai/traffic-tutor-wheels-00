import React, { forwardRef, useState, useImperativeHandle, useRef, useEffect } from 'react';
import quizAppi from "@/services";
import { OptionItem } from '../ui/quizModal/OptionItem';
export interface IQuizControllerProp {
    direction?: 'left' | 'right' | 'up' | 'down';
    onSubmit: (isCorrect: boolean) => void;
    onQuestionLoad: (quiz: GameQuestion) => void
}

// Define the exposed methods for ref
export interface QuizControllerRef {
    loadNext: () => void;
}

interface GameQuestion {
    id: number;
    name: string;
    options: {
        id: number;
        toolTip: string;
        sequence: number;
        weightage: number;
        allowComment: boolean;
        selectionMessage: string;
    }[];
    metadata: {
        ans: string | number;
        imageFile: string;
        position: string;
        duration?: string;
        score?: string;
        imageUrl?: string;
        imageType?: string;
    };
    explanation?: string;
    sequence?: number;
    type?: string;
    lang?: string;
    validations?: unknown;
    selectedOptionId?: number; // Track the selected option ID
}

// Ref-enabled QuizController
const QuizController = forwardRef<QuizControllerRef, IQuizControllerProp>(({ onSubmit, onQuestionLoad }, ref) => {
    const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
    const allQuizs = useRef([]);
    const currentQuizIndex = useRef(0);

    const handleAnswer = (answerIndex) => {
        onSubmit(`${currentQuestion.metadata.ans}` === `${answerIndex}`);
        currentQuizIndex.current = Math.min(currentQuizIndex.current + 1, allQuizs.current.length - 1);
        setCurrentQuestion(null);
        onQuestionLoad(allQuizs.current[currentQuizIndex.current]);
    }

    useImperativeHandle(ref, () => ({
        loadNext: () => {
            try {
                setCurrentQuestion(allQuizs.current[currentQuizIndex.current]);

            } catch {
                alert('error catched while loading next');
            }

        },

    }));

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await quizAppi.getQuestions('Module1');
                // Cast the API response to our ApiQuestionData type for proper typing
                // setssId(data?.data?.ssId);
                const questionsArray = Object.values(data?.data?.initialQuestions)
                    .map((q) => q as GameQuestion)
                    .sort((a, b) => a.sequence - b.sequence);

                console.log("questionsArray", questionsArray);
                // Convert ApiQuestionData to GameQuestion
                const gameQuestions: GameQuestion[] = questionsArray.map((q) => ({
                    id: q.id,
                    name: q.name,
                    type: q.type,
                    lang: q.lang,
                    sequence: q.sequence,
                    metadata: q.metadata,
                    options: q.options,
                    explanation: q.explanation,
                    validations: q.validations,
                }));
                allQuizs.current = gameQuestions;
                onQuestionLoad(allQuizs.current[0]);
            } catch (err) {
                alert('error catched while fetching quiz')
            }
        };
        fetchQuestions();
    }, []);

    return (
        <div>
            {currentQuestion && (
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-green-50/90 p-4 rounded-lg shadow-lg text-center max-w-md w-full z-20">
                    <div className="flex justify-between items-center ">
                        <p className="text-xl font-medium text-green-900 mb-3">
                            {currentQuestion?.name}
                        </p>
                        {/* <div className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium  text-green-900">
                          {questionTimer}s
                        </div> */}
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
            )}
        </div>
    );
});

export default QuizController;
