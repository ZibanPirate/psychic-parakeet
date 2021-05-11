import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import Axios from "axios";
import { LandingPage } from ".";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { SearchMoviesResponse } from "@parakeet/api/src/search/types";
import { Theme } from "src/components/theme";
import { createMainStore } from "src/redux";
import { generateMovieEntityBatchMock } from "@parakeet/api/test/mocks";

jest.useFakeTimers();
jest.mock("axios");
const MockedAxios = Axios as jest.Mocked<typeof Axios>;

const mockedSearchMoviesResponse: SearchMoviesResponse = {
  movies: generateMovieEntityBatchMock(1, 5),
};

describe("Landing Page", () => {
  afterEach(() => cleanup());
  test("Render Landing page", async () => {
    const mainStore = createMainStore();

    const { container } = render(
      <Provider store={mainStore}>
        <Router>
          <Theme>
            <LandingPage />
          </Theme>
        </Router>
      </Provider>,
    );
    await waitFor(() => screen.getByTestId("search-field"));

    expect(container).toMatchSnapshot();
  });

  test("Render Landing page after switching darkMode on", async () => {
    const mainStore = createMainStore();

    const { container } = render(
      <Provider store={mainStore}>
        <Router>
          <Theme>
            <LandingPage />
          </Theme>
        </Router>
      </Provider>,
    );

    await waitFor(() => screen.getByText("🌙"));

    const darkModeModeSwitch = screen.getByTestId("dark-mode-switch");

    fireEvent.click(darkModeModeSwitch);

    await waitFor(() => screen.getByText("🌞"));

    expect(container).toMatchSnapshot();
  });

  test("Render Landing page after typing 'women' in search field then clearing it", async () => {
    MockedAxios.get.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: mockedSearchMoviesResponse });
          }, 1000);
        }),
    );
    const mainStore = createMainStore();

    const { container } = render(
      <Provider store={mainStore}>
        <Router>
          <Theme>
            <LandingPage />
          </Theme>
        </Router>
      </Provider>,
    );

    await waitFor(() => screen.getByTestId("search-field"));

    const searchField = screen.getByTestId("search-field");

    fireEvent.change(searchField, { target: { value: "women" } });

    await waitFor(() => screen.getByDisplayValue("women"));

    jest.advanceTimersByTime(500); // skip debounce time
    await waitFor(() => screen.getByTestId("loading-backdrop-open"));

    expect(container).toMatchSnapshot();

    jest.advanceTimersByTime(1000); // skip api call time
    await waitFor(() =>
      screen.getByText(mockedSearchMoviesResponse.movies[0].title),
    );

    expect(container).toMatchSnapshot();

    fireEvent.change(searchField, { target: { value: "" } });
    await waitFor(() => screen.getByText("Nothing to show yet."));
    expect(container).toMatchSnapshot();
  });

  test("Render Landing page after typing 'women' in search field then API call fails", async () => {
    MockedAxios.get.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject({ message: "network error" });
          }, 1000);
        }),
    );
    const mainStore = createMainStore();

    const { container } = render(
      <Provider store={mainStore}>
        <Router>
          <Theme>
            <LandingPage />
          </Theme>
        </Router>
      </Provider>,
    );

    await waitFor(() => screen.getByTestId("search-field"));

    const searchField = screen.getByTestId("search-field");

    fireEvent.change(searchField, { target: { value: "women" } });

    await waitFor(() => screen.getByDisplayValue("women"));

    jest.advanceTimersByTime(500); // skip debounce time
    await waitFor(() => screen.getByTestId("loading-backdrop-open"));

    expect(container).toMatchSnapshot();

    jest.advanceTimersByTime(1000); // skip api call time
    await waitFor(() => screen.getByTestId("notification-close-button"));
    expect(container).toMatchSnapshot();

    const notificationCloseButton = screen.getByTestId(
      "notification-close-button",
    );
    fireEvent.click(notificationCloseButton);

    expect(container).toMatchSnapshot();
  });
});
