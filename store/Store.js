import { createStore } from "redux";
import dataReducer from "./Reducer";
const store = createStore(dataReducer);
export default store;
