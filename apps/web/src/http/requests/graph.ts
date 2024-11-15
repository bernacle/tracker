import type { CovidDataResponse, GraphRequest } from "@/components/views/covid-tracking/types";
import { api } from "../client";




export async function fetchData(params: GraphRequest): Promise<CovidDataResponse> {
  const response = await api.post<CovidDataResponse>("graph", params);

  return response.data;
}