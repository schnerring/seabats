import axios from "axios";

//import { OpenSkyService } from "@/shared/opensky/OpenSkyService";

jest.mock("axios");
const axiosMock = axios as jest.Mocked<typeof axios>;

describe("getStateVectors", () => {
  it("returns empty if API response is null", async () => {
    axiosMock.get.mockImplementationOnce(() => Promise.resolve(null));
  });
});
