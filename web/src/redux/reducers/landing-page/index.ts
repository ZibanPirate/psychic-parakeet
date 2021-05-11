import { Action } from "src/redux";
import { MovieEntity } from "@parakeet/api/src/app/database/entity/movie";
export interface LandingPageState {
  searchQuery: string;
  movies: MovieEntity[];
  isFetching: boolean;
  errorMessage: string;
}

export const landingPage = (
  state: LandingPageState = {
    searchQuery: "",
    movies: [],
    isFetching: false,
    errorMessage: "",
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
