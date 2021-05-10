import { cleanup, render } from "@testing-library/react";
import { Loading } from ".";

describe("Loading Component", () => {
  afterEach(() => cleanup());

  test("Render Loading component", () => {
    const renderedLoading = render(<Loading />);
    expect(renderedLoading.container).toMatchSnapshot();
  });
});
