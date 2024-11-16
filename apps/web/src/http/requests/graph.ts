import type { CovidDataResponse } from "@/components/views/covid-tracking/types";
import { api } from "../client";

export async function fetchData(params: any): Promise<CovidDataResponse> {
  const response = await api.post<CovidDataResponse>("graph", params);

  return response.data;
}