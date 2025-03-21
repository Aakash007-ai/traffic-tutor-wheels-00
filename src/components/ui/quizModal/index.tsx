import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OptionItem } from "./OptionItem";
import { QuizOption, QuizQuestion } from "./types";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuizQuestion;
  onSubmit?: (sequence: number | null) => void;
}

export function QuizModal({
  isOpen,
  onClose,
  question,
  onSubmit,
}: QuizModalProps) {
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set up and clean up timer
  useEffect(() => {
    if (isOpen) {
      // Get timer duration from question metadata or default to 30 seconds
      const duration = question.metadata?.duration
        ? parseInt(question.metadata.duration)
        : 30;
      setTimeLeft(duration);

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Time's up, close the modal
            handleClose();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    // Clean up timer when component unmounts or modal closes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen]);

  const handleSelectOption = (option: QuizOption) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (onSubmit && selectedOption) {
      // Return the sequence value instead of the full option object
      onSubmit(selectedOption.sequence);
    }
    resetSelection();
    onClose();
  };

  const handleClose = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    resetSelection();
    onClose();
  };

  const resetSelection = () => {
    setSelectedOption(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-auto striped-background border-green-700">
        <DialogHeader className="-mt-6 -mx-6 px-6 py-4 border-b border-green-700 bg-green-50/90">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold text-green-900">
              Quiz Question
            </DialogTitle>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div
                className="timer-clock absolute"
                style={{
                  background: `conic-gradient(#e5e7eb ${
                    100 -
                    (timeLeft /
                      (question.metadata?.duration
                        ? parseInt(question.metadata.duration)
                        : 30)) *
                      100
                  }%, #22c55e 0)`,
                  transform: "rotate(-90deg)",
                }}
              ></div>
              <div className="absolute inset-1 bg-white rounded-full"></div>
              <div className="timer font-medium text-xl text-green-800 w-14 h-14 flex items-center justify-center rounded-full relative z-10">
                {timeLeft}s
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 -mx-6 bg-white/80">
          <div className="text-xl font-medium text-green-900 mb-6">
            {question.name}
          </div>

          <div className="space-y-3">
            {question.options.map((option) => (
              <OptionItem
                key={option.id}
                option={option}
                isSelected={selectedOption?.id === option.id}
                onSelect={handleSelectOption}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="-mb-6 -mx-6 px-6 py-3 border-t border-green-700 bg-green-50/90">
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="bg-green-600 text-white hover:bg-green-700 w-full shadow-md"
          >
            Submit Answer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
