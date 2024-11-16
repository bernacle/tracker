import type { CountriesRepository } from "@/repositories/countries-repository";
import type { CovidCasesRepository } from "@/repositories/covid-cases-repository";
import type { VaccinationsRepository } from "@/repositories/vaccinations-repository";
import type { Country } from "@prisma/client";

export type DemographicFilters = {
  minPopulation?: number;
  maxPopulation?: number;
  minMedianAge?: number;
  maxMedianAge?: number;
  minGdpPerCapita?: number;
  maxGdpPerCapita?: number;
  continent?: string;
  incomeGroup?: string;
  smokerGender?: 'male' | 'female';
};

export type CompareDataParams = {
  baseline: {
    countries?: string[];
    demographics?: DemographicFilters;
    category: "DEMOGRAPHICS" | "COVID" | "VACCINATION";
  };
  comparison?: {
    countries?: string[];
    demographics?: DemographicFilters;
    category: "DEMOGRAPHICS" | "COVID" | "VACCINATION";
  };
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
};


export class CompareDataService {
  constructor(
    private countriesRepository: CountriesRepository,
    private covidCasesRepository: CovidCasesRepository,
    private vaccinationsRepository: VaccinationsRepository
  ) { }

  async execute(params: CompareDataParams) {
    const baselineCountries = await this.fetchCountries({ countries: params.baseline.countries, demographics: params.baseline.demographics });
    const baselineCountryIds = baselineCountries.map((c) => c.id);

    const baselineCovidData =
      params.baseline.category === "COVID"
        ? await this.covidCasesRepository.findByMultipleCountries(
          baselineCountryIds,
          params.dateRange?.startDate || new Date(0),
          params.dateRange?.endDate || new Date()
        )
        : [];

    const baselineVaccinationData =
      params.baseline.category === "VACCINATION"
        ? await this.vaccinationsRepository.findManyByCountriesAndDateRange(
          baselineCountryIds,
          params.dateRange?.startDate || new Date(0),
          params.dateRange?.endDate || new Date()
        )
        : [];

    let comparisonResult = null;

    if (params.comparison) {
      const comparisonCountries = await this.fetchCountries({
        countries: params.comparison.countries,
        demographics: params.comparison.demographics,
      });
      const comparisonCountryIds = comparisonCountries.map((c) => c.id);

      const comparisonCovidData =
        params.comparison.category === "COVID"
          ? await this.covidCasesRepository.findByMultipleCountries(
            comparisonCountryIds,
            params.dateRange?.startDate || new Date(0),
            params.dateRange?.endDate || new Date()
          )
          : [];

      const comparisonVaccinationData =
        params.comparison.category === "VACCINATION"
          ? await this.vaccinationsRepository.findManyByCountriesAndDateRange(
            comparisonCountryIds,
            params.dateRange?.startDate || new Date(0),
            params.dateRange?.endDate || new Date()
          )
          : [];

      comparisonResult = {
        countries: comparisonCountries,
        covidData: comparisonCovidData,
        vaccinationData: comparisonVaccinationData,
      };
    }

    return {
      baseline: {
        countries: baselineCountries,
        covidData: baselineCovidData,
        vaccinationData: baselineVaccinationData,
      },
      comparison: comparisonResult,
    };
  }

  private async fetchCountries(input: {
    countries?: string[];
    demographics?: DemographicFilters;
  }): Promise<Country[]> {
    const filters = input.demographics || {};

    return this.countriesRepository.findAll({
      isoCodes: input.countries,
      continent: filters.continent,
      incomeGroup: filters.incomeGroup,
      population: {
        gte: filters.minPopulation,
        lte: filters.maxPopulation,
      },
      medianAge: {
        gte: filters.minMedianAge,
        lte: filters.maxMedianAge,
      },
      gdpPerCapita: {
        gte: filters.minGdpPerCapita,
        lte: filters.maxGdpPerCapita,
      },
      maleSmokers: filters.smokerGender === "male" ? { not: null } : undefined,
      femaleSmokers: filters.smokerGender === "female" ? { not: null } : undefined,
    });
  }

}

