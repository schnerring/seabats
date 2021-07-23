import axios, { AxiosInstance } from "axios";
import { Aircraft } from "./Aircraft";

export abstract class HttpServiceBase {
  protected instance: AxiosInstance;
  protected readonly baseURL: string;

  public constructor(baseURL?: string) {
    this.baseURL = baseURL ?? "";
    this.instance = axios.create({ baseURL });
  }

  async getAircrafts(): Promise<Aircraft[]> {
    const response = await this.instance({
      baseURL: "",
      url: "aircrafts.json",
    });
    return response.data;
  }
}
