import { port } from ".";

describe("config/index.ts", () => {
  test("port to be defined", () => {
    expect(port).toBeDefined();
  });
});
