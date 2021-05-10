import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { LandingPage } from ".";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { Theme } from "src/components/theme";
import { createMainStore } from "src/redux";

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
    await waitFor(() => screen.getByText("Search goes here"));

    expect(container).toMatchSnapshot();
  });

  test("Render Landing page after switching darkMode on", async () => {
    const mainStore = createMainStore();

    const { container } = render(
      <Provider store={mainStore}>
        <Router>
          <LandingPage />
        </Router>
      </Provider>,
    );

    await waitFor(() => screen.getByText("🌙"));

    const darkModeModeSwitch = screen.getByTestId("dark-mode-switch");

    fireEvent.click(darkModeModeSwitch);

    await waitFor(() => screen.getByText("🌞"));

    expect(container).toMatchSnapshot();
  });
});
