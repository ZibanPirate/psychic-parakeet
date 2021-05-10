import { combineReducers } from "redux";
import { landingPage } from "./landing-page";
import { settings } from "./settings";

export const mainReducer = combineReducers({
  settings,
  landingPage,
});
