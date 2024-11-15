const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const importCountries = require('./import-countries');
const importCovidCases = require('./import-covid-cases');
const importLifeExpectancy = require('./import-life-expectancy');
const importVaccinations = require('./import-vaccinations');
const importVaccinationsByAge = require('./import-vaccinations-age');
const importVaccinationsByManufacturer = require('./import-vaccinations-manufacturer');
const updateAged65Older = require('./update-aged-65-older');
const updateDiabetesPrevalence = require('./update-diabetes-prevalence');
const updateIncomeGroup = require('./update-income-group');
const updateExtremePoverty = require('./update-extreme-poverty');
const updateFemaleSmokers = require('./update-female-smokers');
const updateGdpPerCapita = require('./update-gdp-per-capita');
const updateMaleSmokers = require('./update-male-smokers');
const updatePopulation = require('./update-population');
const updatePopulationDensity = require('./update-population-density');
const multibar = require('./progress-bar');
const { PrismaClient } = require('@prisma/client');
const updateMedianAge = require('./update-median-age');
const updateCardiovascDeathRate = require('./update-cardiovasc-death-rate');
const updateHandwashingFacilities = require('./update-handwashing-facilities');
const updateHumanIndex = require('./update-human-development-index');
const updateHospitalBeds = require('./update-hospital-beds');

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
    await ensureCSVFiles();

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
      updatePopulation(),
      updatePopulationDensity(),
      updateMedianAge(),
      updateCardiovascDeathRate(),
      updateHandwashingFacilities(),
      updateHumanIndex(),
      updateHospitalBeds()
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


async function ensureCSVFiles() {
  log.phase('Checking CSV files');

  const dataDir = path.join(__dirname, '..', 'data');
  const csvDir = path.join(dataDir, 'csv');
  const zipPath = path.join(dataDir, 'csv.zip');

  if (!fs.existsSync(zipPath)) {
    throw new Error('CSV zip file not found! Please ensure csv.zip exists in the data directory.');
  }

  try {
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();

    if (fs.existsSync(csvDir)) {
      fs.rmSync(csvDir, { recursive: true, force: true });
    }

    fs.mkdirSync(csvDir, { recursive: true });

    console.log('\nExtracting files:');
    zipEntries.forEach(entry => {
      if (!entry.isDirectory) {
        const fileName = entry.entryName.split('/').pop();
        if (fileName) {
          const content = zip.readFile(entry);
          const targetPath = path.join(csvDir, fileName);
          fs.writeFileSync(targetPath, content);
          console.log('Extracted:', fileName);
        }
      }
    });

    const requiredFiles = [
      'aged_65_older.csv',
      'cardiovasc_death_rate.csv',
      'cases_deaths.csv',
      'countries.csv',
      'diabetes_prevalence.csv',
      'extreme_poverty.csv',
      'female_smokers.csv',
      'gdp_per_capita.csv',
      'handwashing_facilities.csv',
      'hospital_beds.csv',
      'human_development_index.csv',
      'income_groups.csv',
      'life_expectancy.csv',
      'male_smokers.csv',
      'median_age.csv',
      'population_density.csv',
      'population.csv',
      'vaccinations_age.csv',
      'vaccinations_manufacturer.csv',
      'vaccinations.csv'
    ];

    const missingFiles = requiredFiles.filter(file =>
      !fs.existsSync(path.join(csvDir, file))
    );

    if (missingFiles.length > 0) {
      throw new Error(`Missing CSV files after extraction: ${missingFiles.join(', ')}`);
    }

    log.success('All CSV files extracted and verified');
  } catch (error) {
    log.error('Failed to extract CSV files');
    console.error('Error details:', error);
    throw error;
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

