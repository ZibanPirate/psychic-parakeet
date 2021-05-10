import { GeneralResponse } from "../app/types";
import { OmdbApiController } from "./controller";
import { PullOmdbDataCronJob } from "./cron-job";
import { mock } from "jest-mock-extended";

describe("OmdbApiController", () => {
  const mockedPullOmdbDataCronJobInstance = mock<PullOmdbDataCronJob>();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 with success message", async () => {
    mockedPullOmdbDataCronJobInstance.run.mockResolvedValue();

    const omdbApiController = new OmdbApiController(
      mockedPullOmdbDataCronJobInstance,
    );

    const response = await omdbApiController.pullDataManually();

    expect(response).toMatchObject<GeneralResponse>({
      code: 200,
      msg: "Job-Run Ran Successfully",
    });

    expect(mockedPullOmdbDataCronJobInstance.run).toBeCalled();
  });
});
