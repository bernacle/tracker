import { api } from "../client";

type FetchCountriesServiceResponse = {
  countries: Country[]
}

export type Country = {
  id: string
  isoCode: string;
  name: string;
}

export async function fetchCountries(): Promise<FetchCountriesServiceResponse> {
  const response = await api.get<FetchCountriesServiceResponse>("countries");

  return response.data;
}