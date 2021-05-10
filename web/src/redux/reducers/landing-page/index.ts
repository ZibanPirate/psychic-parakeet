import { Action } from "src/redux";

export interface LandingPageState {
  movies: string[] | null;
}

export const landingPage = (
  state: LandingPageState = {
    movies: [],
  },
  action: Action<LandingPageState>,
) => {
  switch (action.type) {
    case "UPDATE_LANDING_PAGE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
