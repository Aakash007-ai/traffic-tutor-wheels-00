import { useState } from "react";
import { QuizOption } from "./types";

interface OptionItemProps {
  option: QuizOption;
  isSelected: boolean;
  isCorrect?: boolean;
  onSelect: (option: QuizOption) => void;
}

export function OptionItem({ option, isSelected, isCorrect = false, onSelect }: OptionItemProps) {
  // Determine letter based on sequence
  const getLetterBySequence = (sequence: number): string => {
    const letters = ["A", "B", "C", "D"];
    return letters[(sequence - 1) % letters.length];
  };

  // Determine color based on sequence
  const getColorBySequence = (sequence: number): string => {
    const colors = [
      "bg-[#F87171]", // red
      "bg-[#FACC15]", // yellow
      "bg-[#4ADE80]", // green

      "bg-[#60A5FA]", // blue
    ];
    return colors[(sequence - 1) % colors.length];
  };

  const letter = getLetterBySequence(option.sequence);
  const colorClass = getColorBySequence(option.sequence);

  return (
    <div className="option-item" data-option={letter}>
      <button
        className={`w-full flex items-center text-left hover:opacity-90 focus:outline-none transition-all rounded-md ${
          isCorrect ? "ring-2 ring-offset-2 ring-green-700" : ""
        } ${isSelected && !isCorrect ? "ring-2 ring-offset-2 ring-red-700" : ""}`}
        onClick={() => onSelect(option)}
      >
        <div
          className={`flex items-center ${colorClass} text-white rounded-l-md p-3 h-14 w-14 justify-center text-xl font-bold ${
            isCorrect
              ? "border-4 border-green-600"
              : isSelected && !isCorrect
              ? "border-4 border-red-600"
              : "border-2 border-gray-700"
          }`}
        >
          {letter}
        </div>
        <div
          className={`flex-1 p-3 rounded-r-md ${
            isCorrect
              ? "bg-blue-200 border-t-4 border-r-4 border-b-4 border-green-600"
              : isSelected && !isCorrect
              ? "bg-blue-100 border-t-4 border-r-4 border-b-4 border-red-600"
              : "bg-blue-100 border-t-2 border-r-2 border-b-2 border-gray-700"
          }`}
        >
          <span className="text-gray-800 font-medium">{option.toolTip}</span>
        </div>
      </button>
    </div>
  );
}
