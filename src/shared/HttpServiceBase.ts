import axios, { AxiosInstance } from "axios";

export abstract class HttpServiceBase {
  protected instance: AxiosInstance;
  protected readonly baseURL: string;

  public constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.instance = axios.create({ baseURL });
  }
}
