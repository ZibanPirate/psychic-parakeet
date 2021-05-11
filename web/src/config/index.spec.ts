import { config, getEnv } from ".";
import { Environment } from "@parakeet/api/src/config/dto";

/**
 * the preserved location object, when need a deep copy of it on each test
 */
const oldLocation = Object.assign({}, location);
describe("src/config/index.ts", () => {
  // preserve the old location object each time
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.location as any) = Object.assign({}, oldLocation);
  });
  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.location as any) = Object.assign({}, oldLocation);
  });

  test("getEnv return development when location.hostname is localhost", () => {
    expect(getEnv()).toBe<Environment>("development");
  });

  test("getEnv return production when location.hostname is not localhost", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.location as any) = new URL("https://parakeet.zakiii.com");
    expect(getEnv()).toBe<Environment>("production");
  });

  test("getEnv return development when location.hostname is localhost", () => {
    expect(getEnv()).toBe<Environment>("development");
  });

  test("config is defined", () => {
    expect(config).toBeDefined();
  });
});
