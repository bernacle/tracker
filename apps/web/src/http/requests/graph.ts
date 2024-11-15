import type { GraphRequest } from "@/components/views/covid-tracking/types";
import { api } from "../client";


type SignInResponse = {
  token: string;
};

export async function fetchData(params: GraphRequest): Promise<SignInResponse> {
  const response = await api.post<SignInResponse>("graph", params);

  return response.data;
}