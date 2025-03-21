const API_URL =
  "https://insight360.qac24svc.dev/api/v2/config/rating/SafeWayHackers/Module1";

const quizService = () => {
  const getQuestions = async () => {
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

  return {
    getQuestions,
  };
};

export const quizAppi = quizService();
