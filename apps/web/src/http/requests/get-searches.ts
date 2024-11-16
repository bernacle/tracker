import { api } from "../client";

type GetSearchesResponse = {
  searches: Search[],
}

type Search = {
  id: string,
  name: string,
  criteria: string,
}

export async function getSearches(): Promise<GetSearchesResponse> {
  const response = await api.get<GetSearchesResponse>("searches");

  return response.data;
}