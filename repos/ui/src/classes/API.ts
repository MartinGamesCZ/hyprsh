import { CFG_BACKEND_URL } from "@/config";
import axios from "axios";

interface IAPIError {
  message: string;
  error: string;
}

export class API {
  private static readonly connector = axios.create({
    baseURL: `${CFG_BACKEND_URL}/api`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  static async get<T>(path: string): Promise<T | IAPIError> {
    const { data } = await this.connector.get<T>(path).catch((e) => ({
      data: e.response?.data ?? {
        message: "Unknown error",
        error: "UNKNOWN",
      },
    }));

    return data;
  }

  static async post<T, B>(path: string, body: B): Promise<T | IAPIError> {
    const { data } = await this.connector.post<T>(path, body).catch((e) => ({
      data: e.response?.data ?? {
        message: "Unknown error",
        error: "UNKNOWN",
      },
    }));

    return data;
  }
}
