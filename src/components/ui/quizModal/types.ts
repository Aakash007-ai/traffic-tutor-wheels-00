// Define the interface for quiz option items
export interface QuizOption {
  id: number;
  toolTip: string;
  sequence: number;
  metadata?: any;
  imgUrl?: {
    active: { type: string; url: string };
    inactive: { type: string; url: string };
  };
  weightage?: number;
  allowComment?: boolean;
  selectionMessage?: string;
}

// Define the interface for the quiz question
export interface QuizQuestion {
  id: number;
  name: string;
  type: string;
  lang: string;
  metadata?: {
    duration: string;
    score: string;
    imageFile?: string;
    ans?: string;
    imageUrl?: string;
    position?: string;
    imageType?: string;
  };
  validations?: any;
  sequence: number;
  options: QuizOption[];
}
