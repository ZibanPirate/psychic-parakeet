import Axios from "axios";
import { GeneralResponse } from "../src/app/types";
import { SearchMoviesResponse } from "../src/search/types";
import { apiURL } from "./config";

describe("SearchController", () => {
  it("return 200 with mes is current date", async () => {
    const { data } = await Axios.post(
      `${apiURL}/OmdbApi/PullDataManually`,
      {},
      {
        headers: {
          Authorization: "Bearer test-job-token",
        },
      },
    );
    expect(data).toMatchObject<GeneralResponse>({
      code: 200,
      msg: "Job-Run Ran Successfully",
    });
  });

  it("return 200 empty array of movies and mes with 0 results", async () => {
    const { data } = await Axios.get(
      `${apiURL}/Search/Movies?query=Gore+from+Outer+Space`,
    );
    expect(data).toMatchObject<SearchMoviesResponse>({
      code: 200,
      msg: "Found 1 results",
      movies: [
        {
          director: "Hirohisa Sasaki",
          id: "tt0321649",
          plot:
            "A woman is sent to execution for the murder of her daughter, who she believes is kidnapped. When she tells her story to a nun, we learn her story through a series of encounters with a ...",
          poster:
            "https://m.media-amazon.com/images/M/MV5BNTk2Nzg3NDEtMjQ4NC00Nzk4LWE0YmYtZTdmODYzYjIxOTljXkEyXkFqcGdeQXVyMzU0NzkwMDg@._V1_SX300.jpg",
          title: "Gore from Outer Space",
          year: "2001",
        },
      ],
    });
  });
});
