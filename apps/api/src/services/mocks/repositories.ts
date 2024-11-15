import type { CountriesRepository } from '@/repositories/countries-repository';
import type { CovidCasesRepository } from '@/repositories/covid-cases-repository';
import type { VaccinationsRepository } from '@/repositories/vaccinations-repository';
import { vi } from 'vitest';

export const mockCountriesRepository = {
  findAll: vi.fn(),
} as unknown as CountriesRepository;

export const mockCovidCasesRepository = {
  findByMultipleCountries: vi.fn(),
} as unknown as CovidCasesRepository;

export const mockVaccinationsRepository = {
  findManyByCountriesAndDateRange: vi.fn(),
} as unknown as VaccinationsRepository;
