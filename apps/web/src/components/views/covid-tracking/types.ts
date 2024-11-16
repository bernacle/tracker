export const METRIC_CATEGORIES = {
  DEMOGRAPHICS: 'DEMOGRAPHICS',
  COVID: 'COVID',
  VACCINATION: 'VACCINATION',
} as const;

export type MetricCategory = typeof METRIC_CATEGORIES[keyof typeof METRIC_CATEGORIES];


export type Category = 'COVID' | 'DEMOGRAPHICS' | 'VACCINATION';

export type CategoryMetrics = {
  COVID: CovidMetric;
  DEMOGRAPHICS: DemographicsMetric;
  VACCINATION: VaccinationMetric;
};

export type CovidMetric = 'newCases' | 'totalCases' | 'newDeaths' | 'totalDeaths';

export type DemographicsMetric =
  | 'population'
  | 'populationDensity'
  | 'medianAge'
  | 'aged65Older'
  | 'gdpPerCapita'
  | 'extremePoverty'
  | 'cardiovascDeathRate'
  | 'diabetesPrevalence'
  | 'femaleSmokers'
  | 'maleSmokers'
  | 'handwashingFacilities'
  | 'hospitalBedsPerThousand'
  | 'humanDevelopmentIndex';

export type VaccinationMetric =
  | 'totalVaccinations'
  | 'peopleVaccinated'
  | 'peopleFullyVaccinated'
  | 'totalBoosters'
  | 'dailyVaccinations'
  | 'peopleUnvaccinated'

export type Metric = CovidMetric | DemographicsMetric | VaccinationMetric;

export type Country = {
  id: string;
  name: string;
  isoCode: string;
  continent: string;
  population: number;
  populationDensity: number;
  medianAge: number;
  aged65Older: number;
  gdpPerCapita: number;
  extremePoverty: number | null;
  cardiovascDeathRate: number;
  diabetesPrevalence: number;
  femaleSmokers: number | null;
  maleSmokers: number | null;
  handwashingFacilities: number | null;
  hospitalBedsPerThousand: number | null;
  humanDevelopmentIndex: number;
  incomeGroup: string;
};


export type CovidData = {
  id: string;
  date: string;
  newCases: number;
  totalCases: number;
  newDeaths: number;
  totalDeaths: number;
  countryId: string;
};

export type VaccinationData = {
  id: string;
  date: string;
  totalVaccinations: number;
  peopleVaccinated: number;
  peopleFullyVaccinated: number;
  totalBoosters: number | null;
  dailyVaccinations: number | null;
  dailyVaccinationsSmoothed: number | null;
  dailyPeopleVaccinatedSmoothed: number | null;
  totalVaccinationsPerHundred: number | null;
  peopleVaccinatedPerHundred: number | null;
  peopleFullyVaccinatedPerHundred: number | null;
  totalBoostersPerHundred: number | null;
  dailyPeopleVaccinatedSmoothedPerHundred: number | null;
  dailyVaccinationsSmoothedPerMillion: number | null;
  peopleUnvaccinated: number | null;
  shareOfBoosters: number | null;
  countryId: string;
};

export type ChartData = {
  covidData: CovidData[];
  vaccinationData: VaccinationData[];
  countries: Country[];
};

export type CovidDataResponse = {
  baseline: ChartData;
  comparison: ChartData | null;
};

export type ComparisonData = {
  baselineCountry: string;
  comparisonCountry?: string;
  category: MetricCategory;
  metric: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
};

type DateRange = {
  startDate: string;
  endDate: string;
};

export type GraphRequest = {
  baseline: ComparisonSection;
  comparison?: ComparisonSection;
  dateRange?: DateRange;
};

type ComparisonSection = {
  countries: string[];
  category: MetricCategory;
  metric: string;
};


