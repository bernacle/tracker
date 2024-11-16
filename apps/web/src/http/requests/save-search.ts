import { api } from "../client";


type SaveSearchRequest = {
  name: string,
  criteria: string,
}

type SaveSearchResponse = {
  id: string,
  name: string,
  criteria: string,
}

export async function saveSearch({ criteria, name }: SaveSearchRequest): Promise<SaveSearchResponse> {
  const response = await api.post<SaveSearchResponse>("searches", { criteria, name });

  return response.data;
}