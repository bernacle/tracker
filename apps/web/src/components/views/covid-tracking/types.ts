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

export interface GraphRequest {
  baseline: {
    countries?: string[]
    demographics?: Demographics
  }
  comparison?: {
    countries?: string[]
    demographics?: Demographics
  }
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
  countryId: string
  countryName?: string
}

export interface CovidDataResponse {
  baseline: CovidData[]
  comparison?: CovidData[]
}

export interface ChartData extends CovidData {
  formattedDate: string
}

export interface DemographicsFormProps {
  onSubmit: (demographics: Demographics) => void
  isComparison?: boolean
  defaultValues?: Demographics
}

export interface ChartProps {
  baselineData: CovidData[]
  comparisonData?: CovidData[]
  type?: 'cases' | 'deaths' | 'combined'
}