const BASE_API_URL =
  "https://insight360.qac24svc.dev/api/v2/config/rating/SafeWayHackers";
const SCORE_FEEDBACK_API_URL =
  "https://safeway-hackers-466060604919.us-central1.run.app/api/v1/submit/score-feedback";

const CLUSTER_API_URL =
  "https://insight360.qac24svc.dev/api/v2/config/rating/SafeWayHackers/SelfVehicleAwareness";

const quizService = () => {
  const getQuestions = async (
    module: string = "Module_1",
    language: string = "ENGLISH"
  ) => {
    const currentModule = language === "ENGLISH" ? module : "Module1_Hindi";
    const API_URL = `${BASE_API_URL}/${currentModule}`;
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data; // Ensure you're returning parsed JSON
    } catch (error) {
      console.error("Error fetching rating config:", error);
      throw error;
    }
  };

  // Define the question interface based on the API response structure
  interface QuestionOption {
    id: number;
    toolTip: string;
    sequence: number;
    weightage: number;
    allowComment: boolean;
    selectionMessage: string;
    imgUrl?: {
      active: { type: string; url: string };
      inactive: { type: string; url: string };
    };
    metadata?: Record<string, unknown>;
  }

  // This interface should match the GameQuestion interface in Quiz.tsx
  interface QuestionData {
    id: number;
    name: string;
    type?: string;
    lang?: string;
    sequence?: number;
    metadata: {
      ans: string | number;
      score?: string;
      imageFile?: string;
      duration?: string;
      position?: string;
      imageUrl?: string;
      imageType?: string;
    };
    options: QuestionOption[];
    explanation?: string;
    validations?: unknown;
    selectedOptionId?: number; // Track the selected option ID
  }

  const submitScoreFeedback = async (
    score: number,
    questions: QuestionData[],
    ssId: number,
    level: number = 1,
    userId: string // Default value for backward compatibility
  ) => {
    const fetchAccessToken = () => {
      const cookies = document.cookie.split("; ");
      const accessTokenCookie = cookies.find((row) =>
        row.startsWith("accessToken=")
      );
      return accessTokenCookie ? accessTokenCookie.split("=")[1] : null;
    };

    try {
      // Transform questions into the format required by the API
      const answers = questions.map((question) => {
        // Use the selectedOptionId if available, otherwise fall back to the answer from metadata
        const optionId = question.selectedOptionId;
        return {
          questionId: question.id,
          optionId: optionId,
          weightage: 1,
          comment: "",
          metadata: {},
        };
      });

      const payload = {
        scoreRequest: {
          level: level,
          score: score,
        },
        feedbackRequestDto: {
          ssId: ssId,
          identifierId: "AI-SUMMIT-INVITATION",
          userId: userId,
          channel: "all",
          feedbackGivenBy: userId,
          feedbackGivenByEntityType: "USER",
          answer: answers,
          identifierType: "ai-summit-invitation",
          feedbackGivenFor: "ai-summit-invitation",
          feedbackGivenForEntityType: "USER",
          userType: "OPS",
        },
      };

      console.log("Submitting score and feedback:", payload);

      const response = await fetch(SCORE_FEEDBACK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fetchAccessToken()}`, // Replace with actual token when available
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error submitting score and feedback:", error);
      throw error;
    }
  };

  const getClusterQuestions = async () => {
    try {
      const response = await fetch(CLUSTER_API_URL, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching rating config:", error);
      throw error;
    }
  };

  return {
    getQuestions,
    submitScoreFeedback,
    getClusterQuestions,
  };
};

const quizAppi = quizService();

export default quizAppi;
