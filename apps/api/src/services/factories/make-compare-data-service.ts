import { PrismaCountriesRepository } from "@/repositories/prisma/prisma-countries-repository";
import { PrismaCovidCaseRepository } from "@/repositories/prisma/prisma-covid-cases-repository";
import { PrismaVaccinationRepository } from "@/repositories/prisma/prisma-vaccinations-repository";
import { CompareDataService } from "../compare-data-service";

export function makeCompareDataService() {
  const countriesRepository = new PrismaCountriesRepository();
  const covidCasesRepository = new PrismaCovidCaseRepository();
  const vaccinationsRepository = new PrismaVaccinationRepository();

  const useCase = new CompareDataService(
    countriesRepository,
    covidCasesRepository,
    vaccinationsRepository
  );

  return useCase
}