import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { NotFoundPage } from ".";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { Theme } from "src/components/theme";
import { createMainStore } from "src/redux";

describe("NotFound Page", () => {
  afterEach(() => cleanup());
  test("Render NotFound page", async () => {
    const mainStore = createMainStore();

    const { container } = render(
      <Provider store={mainStore}>
        <Router>
          <Theme>
            <NotFoundPage />
          </Theme>
        </Router>
      </Provider>,
    );
    await waitFor(() => screen.getByText("Go Back Home"));

    expect(container).toMatchSnapshot();
  });
});
