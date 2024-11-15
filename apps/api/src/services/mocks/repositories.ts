import type { CountriesRepository } from '@/repositories/countries-repository';
import type { CovidCasesRepository } from '@/repositories/covid-cases-repository';
import type { UsersRepository } from '@/repositories/users-repositories';
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

export const mockUsersRepository = {
  findByEmail: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
} as unknown as UsersRepository;


