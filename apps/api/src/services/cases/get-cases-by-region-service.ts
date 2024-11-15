import type { CountriesRepository } from "@/repositories/countries-repository"
import type { CovidCasesRepository } from "@/repositories/covid-cases-repository"
import type { CovidCase } from "@prisma/client"

type GetCasesByRegionParams = {
  continent?: string
  countries?: string[]
  dateRange: {
    startDate: Date
    endDate: Date
  }
  demographicFilters?: {
    minPopulation?: number
    maxPopulation?: number
    minGdpPerCapita?: number
    maxGdpPerCapita?: number
  }
}

export class GetCasesByRegionService {
  constructor(
    private countryRepository: CountriesRepository,
    private covidCaseRepository: CovidCasesRepository
  ) { }

  async execute(params: GetCasesByRegionParams) {

    const countries = await this.countryRepository.findAll({
      continent: params.continent,
      population: {
        gte: params.demographicFilters?.minPopulation,
        lte: params.demographicFilters?.maxPopulation
      },
      gdpPerCapita: {
        gte: params.demographicFilters?.minGdpPerCapita,
        lte: params.demographicFilters?.maxGdpPerCapita
      }
    })

    const countryIds = countries.map(country => country.id)

    const cases = await this.covidCaseRepository.findByMultipleCountries(
      countryIds,
      params.dateRange.startDate,
      params.dateRange.endDate
    )

    return {
      countries,
      cases,
      aggregates: {
        totalCases: this.calculateTotalCases(cases),
        averageCasesByCountry: this.calculateAverageCases(cases, countries.length),
        peakCases: this.findPeakCases(cases)
      }
    }
  }

  private calculateTotalCases(cases: Record<number, CovidCase[]>): number {
    return Object.values(cases).reduce((total, countryCases) => {
      const lastCase = countryCases[countryCases.length - 1]
      return total + (lastCase?.totalCases || 0)
    }, 0)
  }

  private calculateAverageCases(cases: Record<number, CovidCase[]>, countryCount: number): number {
    const total = this.calculateTotalCases(cases)
    return total / countryCount
  }

  private findPeakCases(cases: Record<number, CovidCase[]>) {
    let maxCases = 0
    let peakDate: Date | null = null
    let countryId: number | null = null

    Object.entries(cases).forEach(([countryIdStr, countryCases]) => {
      countryCases.forEach(case_ => {
        if ((case_.newCases || 0) > maxCases) {
          maxCases = case_.newCases || 0
          peakDate = case_.date
          countryId = parseInt(countryIdStr)
        }
      })
    })

    return { maxCases, peakDate, countryId }
  }
}
