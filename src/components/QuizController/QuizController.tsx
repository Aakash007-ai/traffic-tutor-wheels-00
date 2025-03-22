import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import quizAppi from "@/services";
import { OptionItem } from "../ui/quizModal/OptionItem";
import OptionsPopUp from "../OptionsPopUp/OptionsPopUp";
import GameOverPopup from "../GameOverPopup/GameOverPopup";
export interface IQuizControllerProp {
  direction?: "left" | "right" | "up" | "down";
  onSubmit: (isCorrect: boolean, score: number) => void;
  onQuestionLoad: (quiz: GameQuestion) => void;
  onRestart: () => void;
}

// Define the exposed methods for ref
export interface QuizControllerRef {
  loadNext: () => void;
  onGameOver: () => void;
}

export interface GameQuestion {
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
const QuizController = forwardRef<QuizControllerRef, IQuizControllerProp>(
  ({ onSubmit, onQuestionLoad, onRestart }, ref) => {
    const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(
      null
    );
    const [gameOver, setGameOver] = useState(true);
    const allQuizs = useRef([]);
    const currentQuizIndex = useRef(0);

    const handleAnswer = (answerIndex) => {
      onSubmit(
        `${currentQuestion.metadata.ans}` === `${answerIndex}`,
        Number(currentQuestion?.metadata?.score || 0)
      );
      currentQuizIndex.current = Math.min(
        currentQuizIndex.current + 1,
        allQuizs.current.length - 1
      );
      setCurrentQuestion(null);
      onQuestionLoad(allQuizs.current[currentQuizIndex.current]);
    };

    useImperativeHandle(ref, () => ({
      loadNext: () => {
        try {
          setCurrentQuestion(allQuizs.current[currentQuizIndex.current]);
        } catch {
          alert("error catched while loading next");
        }
      },
      onGameOver: () => {
        setGameOver(true);
      },
    }));

    useEffect(() => {
      const fetchQuestions = async () => {
        try {
          const data = await quizAppi.getQuestions("Module_1");
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
          alert("error catched while fetching quiz");
        }
      };
      fetchQuestions();
    }, []);

    return (
      <div>
        {currentQuestion && !gameOver && (
          <OptionsPopUp
            currentQuestion={currentQuestion}
            handleAnswer={handleAnswer}
          />
        )}
        {gameOver && (
          <GameOverPopup
            toggleLang={() => {}}
            score={0}
            onPressStart={() => {
              setGameOver(false);
              currentQuizIndex.current = 0;
              onQuestionLoad(allQuizs.current[0]);
              onRestart();
            }}
          />
        )}
      </div>
    );
  }
);

export default QuizController;
