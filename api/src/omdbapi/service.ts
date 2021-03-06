import Axios from "axios";
import { ConfigService } from "../config/service";
import { Service } from "typedi";

@Service()
export class OmdbApiService {
  constructor(private configService: ConfigService) {}

  public search = async ({ query, type, year, page }: OmdbApiSearchParams) => {
    let url = `http://www.omdbapi.com/?apiKey=${
      this.configService.env().OMDBAPI_API_KEY
    }&s=${query}`;
    type ? (url = `${url}&type=${type}`) : null;
    year ? (url = `${url}&y=${year}`) : null;
    page ? (url = `${url}&page=${page}`) : null;

    const {
      data: {
        Response,
        totalResults,
        Search: omdbRecords,
        Error: errorMessage,
      },
    } = await Axios.get<OmdbApiSearchResponse>(url);
    if (Response !== "True") {
      throw new Error(errorMessage || "OmdbApi.com API failure");
    }

    return {
      count: Number(totalResults),
      omdbRecords,
    };
  };

  public findOne = async (imdbID: string): Promise<OmdbRecord> => {
    const url = `http://www.omdbapi.com/?apiKey=${
      this.configService.env().OMDBAPI_API_KEY
    }&plot=full&i=${imdbID}`;

    const {
      data: { Response, Error: errorMessage, ...omdbRecord },
    } = await Axios.get<OmdbApiFindOneResponse>(url);
    if (Response !== "True") {
      throw new Error(errorMessage || "OmdbApi.com API failure");
    }

    return omdbRecord;
  };
}

export interface OmdbApiSearchParams {
  query: string;
  type?: "movie" | "series" | "episode";
  year?: number;
  page?: number;
}

export interface OmdbApiSearchResponse {
  Search: OmdbRecord[];
  totalResults: string;
  Response: "True" | "False";
  Error?: string;
}

export interface OmdbApiFindOneResponse extends OmdbRecord {
  Response: "True" | "False";
  Error?: string;
}

export interface OmdbRecord {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  Director: string;
  Plot: string;
}
