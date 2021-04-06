import { combineReducers } from "redux";
import cellsReducer from "./cellsReducer";

const reducers = combineReducers({
  cells: cellsReducer,
});

export default reducers;

/*
  - define the type that describes the
    entire state object inside the
    redux store 
*/

export type RootState = ReturnType<typeof reducers>;
