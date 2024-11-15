export interface Demographics {
  minPopulation?: number
  maxPopulation?: number
  minMedianAge?: number
  maxMedianAge?: number
  minGdpPerCapita?: number
  maxGdpPerCapita?: number
  continent?: string
  incomeGroup?: string
  smokerGender?: 'male' | 'female'
}

export interface DataSection {
  countries: string[]
  demographics?: Demographics
}

export interface GraphRequest {
  baseline: DataSection
  comparison?: DataSection
  dateRange: {
    startDate: string
    endDate: string
  }
}

export interface CovidData {
  date: string
  newCases: number
  totalCases: number
  newDeaths: number
  totalDeaths: number
}

export interface CovidDataResponse {
  baseline: CovidData[]
  comparison?: CovidData[]
}

export interface DemographicsFormProps {
  onSubmit: (data: DataSection) => void
  isComparison?: boolean
  defaultValues?: DataSection
  availableCountries: Array<{ id: string; name: string }>
}

export interface ChartProps {
  baselineData: CovidData[]
  comparisonData?: CovidData[]
  type?: 'cases' | 'deaths' | 'combined'
}