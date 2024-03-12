import PiecesService from "../services/pieces.service";

export const getAllPieces = () => {
  return PiecesService.getPieces().then(
    (response) => {
      console.log("pieces action");

      return response.data;
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return Promise.reject();
    }
  );
};