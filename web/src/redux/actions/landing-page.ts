import Axios from "axios";
import { LandingPageState } from "src/redux/reducers/landing-page";
import { SearchMoviesResponse } from "@parakeet/api/src/search/types";
import { ThunkResult } from "src/redux";
import { config } from "src/config";

const apiEndpoint = config.api.url;

/**
 * Fetches the movies
 */
export const searchMoviesThunk =
  (): ThunkResult<LandingPageState> => async (dispatch, getState) => {
    const searchQuery = getState().landingPage.searchQuery.trim();
    if (searchQuery === "") {
      dispatch({
        type: "UPDATE_LANDING_PAGE",
        payload: {
          isFetching: false,
          movies: [],
        },
      });
      return;
    }

    dispatch({ type: "UPDATE_LANDING_PAGE", payload: { isFetching: true } });
    try {
      const { data } = await Axios.get<SearchMoviesResponse>(
        `${apiEndpoint}/Search/Movies?query=${searchQuery}`,
      );

      dispatch({
        type: "UPDATE_LANDING_PAGE",
        payload: { isFetching: false, errorMessage: "", movies: data.movies },
      });
    } catch (error) {
      dispatch({
        type: "UPDATE_LANDING_PAGE",
        payload: {
          isFetching: false,
          errorMessage: "Network error, please try again in a while.",
        },
      });
    }
  };
