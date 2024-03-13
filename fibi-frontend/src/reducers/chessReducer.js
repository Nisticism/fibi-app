const initialState = {
  squaresize: Math.floor(window.innerHeight/10)
};

const chessReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_SQUARE_SIZE":
      return {
        ...state,
        [action.squaresize.name]: action.squaresize.value,
      };
    case "RESET_SQUARE_SIZE":
      return initialState;
    case "SET_SQUARE_SIZE_FOR_EDIT":
      return state;
    default:
      return state;
  }
};

export default chessReducer;
