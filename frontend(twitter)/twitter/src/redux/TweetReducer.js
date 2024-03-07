const InitialState = {
  tweet: {}
};

const TweetReducer = (state = InitialState, action) => {
  switch (action.type) {
    case "DETAILS":
      return {
        tweet: action.payload
      };
    case "CLEAR":
      return InitialState; // Reset the state to its initial state
    default:
      return state; // Return the current state for any other action
  }
};

export default TweetReducer;
