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
const importVaccinationsByAge = require('./import-vaccinations-age');
const importVaccinationsByManufacturer = require('./import-vaccinations-manufacturer');
const { PrismaClient } = require('@prisma/client');
const multibar = require('./progress-bar');

const prisma = new PrismaClient();

const log = {
  phase: (name) => console.log(`\n[PHASE] ${name}`),
  success: (msg) => console.log(`✓ ${msg}`),
  error: (msg) => console.error(`✗ ${msg}`),
  summary: (data) => {
    const { time } = data;

    if (time) {
      console.log(`  → Time: ${time}ms`);
    }
  }
};

async function verifyCountries() {
  const count = await prisma.country.count();
  if (count === 0) {
    throw new Error('Countries table is empty after import');
  }
  return count;
}

async function seedDatabase() {
  const startTime = Date.now();

  try {
    log.phase('Importing and verifying country data');
    await importCountries();
    await verifyCountries();

    log.phase('Updating country attributes');
    const updates = [
      updateAged65Older(),
      updateDiabetesPrevalence(),
      updateIncomeGroup(),
      updateExtremePoverty(),
      updateFemaleSmokers(),
      updateGdpPerCapita(),
      updateMaleSmokers(),
      updatePopulationDensity()
    ];

    await Promise.all(updates);
    log.success('All country attributes updated');

    log.phase('Importing main datasets');
    await Promise.all([
      importCovidCases(),
      importLifeExpectancy(),
      importVaccinations(),
      importVaccinationsByAge(),
      importVaccinationsByManufacturer()
    ]);

    multibar.stop();

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    log.phase('Database Seeding Complete');
    log.success(`Total time: ${totalTime}s`);

  } catch (error) {
    multibar.stop();
    log.error('Seeding failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// If running directly
if (require.main === module) {
  seedDatabase()
    .catch(error => {
      log.error('Fatal error during seeding');
      console.error(error);
      process.exit(1);
    });
}