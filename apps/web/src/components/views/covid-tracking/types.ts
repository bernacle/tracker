export const METRIC_CATEGORIES = {
  DEMOGRAPHICS: 'DEMOGRAPHICS',
  COVID: 'COVID',
  VACCINATION: 'VACCINATION'
} as const

export type MetricCategory = typeof METRIC_CATEGORIES[keyof typeof METRIC_CATEGORIES]

export type Country = {
  id: string
  name: string
}

export type CovidData = {
  id: string
  date: string
  newCases: number
  totalCases: number
  newDeaths: number
  totalDeaths: number
  countryId: string
}

export type VaccinationData = {
  id: string
  date: string
  totalVaccinations: number
  peopleVaccinated: number
  peopleFullyVaccinated: number
  totalVaccinationsPerHundred: number
  [key: string]: string | number | null
}


export type ChartData = {
  covidData: CovidData[]
  vaccinationData: VaccinationData[]
  countries: Country[]
}

export type CovidDataResponse = {
  baseline: ChartData
  comparison: ChartData
}

export type ComparisonData = {
  baselineCountry: string
  comparisonCountry: string
  category: MetricCategory
  metric: string
  dateRange?: {
    startDate: Date
    endDate: Date
  }
}

type ComparisonSection = {
  countries: string[];
  category: MetricCategory;
  metric: string;
}

type DateRange = {
  startDate: string;
  endDate: string;
}

export type GraphRequest = {
  baseline: ComparisonSection;
  comparison?: ComparisonSection;
  dateRange?: DateRange;
}