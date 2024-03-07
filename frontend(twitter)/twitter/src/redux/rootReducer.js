import userReducer from "./userReducer";
import TweetReducer from "./TweetReducer";


import { combineReducers } from "redux"

const rootReducers = combineReducers({
   user: userReducer,
   TweetReducer: TweetReducer


});


export default rootReducers