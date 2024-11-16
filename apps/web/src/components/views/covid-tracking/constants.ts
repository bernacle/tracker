export const METRIC_CATEGORIES = {
  DEMOGRAPHICS: 'Demographics',
  COVID: 'COVID Data',
  VACCINATION: 'Vaccination Data',
} as const

export const METRICS = {
  DEMOGRAPHICS: {
    income_group: 'Income Group',
    population_density: 'Population Density',
    median_age: 'Median Age',
    gdp_per_capita: 'GDP per Capita',
    cardiovasc_death_rate: 'Cardiovascular Death Rate',
    diabetes_prevalence: 'Diabetes Prevalence',
    female_smokers: 'Female Smokers %',
    male_smokers: 'Male Smokers %',
    hospital_beds_per_thousand: 'Hospital Beds per 1000',
    human_development_index: 'Human Development Index',
  },
  COVID: {
    newCases: 'New Cases',
    totalCases: 'Total Cases',
    newDeaths: 'New Deaths',
    totalDeaths: 'Total Deaths',
  },
  VACCINATION: {
    totalVaccinations: 'Total Vaccinations',
    peopleVaccinated: 'People Vaccinated',
    peopleFullyVaccinated: 'People Fully Vaccinated',
    totalBoosters: 'Total Boosters',
    dailyVaccinations: 'Daily Vaccinations',
    peopleUnvaccinated: 'People Unvaccinated',
  },
} as const