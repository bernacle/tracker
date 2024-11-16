import type { Country } from "@/components/views/covid-tracking/types";
import { api } from "../client";

export const fetchCountries = async (): Promise<{ countries: Country[] }> => {
  const response = await api.get("/countries");
  const data = await response.data

  const countries: Country[] = data.countries.map((country: any) => ({
    id: country.id,
    name: country.name,
    isoCode: country.isoCode,
    continent: country.continent || "Unknown",
    population: country.population || 0,
    populationDensity: country.populationDensity || 0,
    medianAge: country.medianAge || 0,
    aged65Older: country.aged65Older || 0,
    gdpPerCapita: country.gdpPerCapita || 0,
    extremePoverty: country.extremePoverty || null,
    cardiovascDeathRate: country.cardiovascDeathRate || 0,
    diabetesPrevalence: country.diabetesPrevalence || 0,
    femaleSmokers: country.femaleSmokers || null,
    maleSmokers: country.maleSmokers || null,
    handwashingFacilities: country.handwashingFacilities || null,
    hospitalBedsPerThousand: country.hospitalBedsPerThousand || null,
    humanDevelopmentIndex: country.humanDevelopmentIndex || 0,
    incomeGroup: country.incomeGroup || "Unknown",
  }));

  return { countries };
};
