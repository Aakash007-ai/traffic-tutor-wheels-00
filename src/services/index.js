const QuizService = () => {
  const getQuestions = () => {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.olamaps.io/places/v1/autocomplete?input=${searchValue}&api_key=${process.env.NX_PUBLIC_OLA_PLACES_API_API_KEY}`
      )
        .then((response) => {
          resolve(response.json());
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  //   const fetchAddressFromCoordinates = ({ latitude, longitude }) => {
  //     return new Promise((resolve, reject) => {
  //       fetch(
  //         `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${latitude},${longitude}&api_key=${process.env.NX_PUBLIC_OLA_PLACES_API_API_KEY}`
  //       )
  //         .then((response) => {
  //           resolve(response.json());
  //         })
  //         .catch((error) => {
  //           reject(error);
  //         });
  //     });
  //   };

  return {
    getSearchLocationResults,
    fetchAddressFromCoordinates,
  };
};

export const mapsApi = QuizService();
