const importCountries = require('./import-countries');
const updateAged65Older = require('./update-aged-65-older');
const updateDiabetesPrevalence = require('./update-diabetes-prevalence');
const updateIncomeGroup = require('./update-income-group');
const updateExtremePoverty = require('./update-extreme-poverty');
const updateFemaleSmokers = require('./update-female-smokers');
const updateGdpPerCapita = require('./update-gdp-per-capita');
const updateMaleSmokers = require('./update-male-smokers');
const updatePopulationDensity = require('./update-population-density');
const importCovidCases = require('./import-covid-cases');
const importLifeExpectancy = require('./import-life-expectancy');
const importVaccinations = require('./import-vaccinations');
const importVaccinationsByAge = require('./import-vaccinations-by-age');
const importVaccinationsByManufacturer = require('./import-vaccinations-by-manufacturer');

async function main() {
  console.log("Starting database seeding...");

  await importCountries();
  await updateAged65Older();
  await updateDiabetesPrevalence();
  await updateIncomeGroup();
  await updateExtremePoverty();
  await updateFemaleSmokers();
  await updateGdpPerCapita();
  await updateMaleSmokers();
  await updatePopulationDensity();
  await importCovidCases();
  await importLifeExpectancy();
  await importVaccinations();
  await importVaccinationsByAge();
  await importVaccinationsByManufacturer();

  console.log("Database seeding completed successfully.");
}

main().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
