const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const multibar = require('./progress-bar');

const prisma = new PrismaClient({
  log: ['error']
});

async function importVaccinations() {
  const BATCH_SIZE = 1000;
  let processedCount = 0;
  let successCount = 0;
  const filePath = path.join(__dirname, '../data/csv/vaccinations.csv');

  const countries = await prisma.country.findMany();
  const countryMap = new Map(
    countries.map(country => [country.name.toLowerCase().trim(), country.id])
  );

  const totalRecords = await new Promise((resolve) => {
    let count = 0;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', () => count++)
      .on('end', () => resolve(count));
  });

  const progressBar = multibar.create(totalRecords, 0, { title: 'Vaccinations' });

  return new Promise((resolve, reject) => {
    let currentBatch = [];

    const processBatch = async (records) => {
      try {
        const validRecords = records
          .filter(row => countryMap.has(row.country.toLowerCase().trim()))
          .map(row => ({
            date: new Date(row.date),
            totalVaccinations: row.total_vaccinations ? parseFloat(row.total_vaccinations) : null,
            peopleVaccinated: row.people_vaccinated ? parseFloat(row.people_vaccinated) : null,
            peopleFullyVaccinated: row.people_fully_vaccinated ? parseFloat(row.people_fully_vaccinated) : null,
            totalBoosters: row.total_boosters ? parseFloat(row.total_boosters) : null,
            dailyVaccinations: row.daily_vaccinations ? parseFloat(row.daily_vaccinations) : null,
            dailyVaccinationsSmoothed: row.daily_vaccinations_smoothed ? parseFloat(row.daily_vaccinations_smoothed) : null,
            dailyPeopleVaccinatedSmoothed: row.daily_people_vaccinated_smoothed ? parseFloat(row.daily_people_vaccinated_smoothed) : null,
            totalVaccinationsPerHundred: row.total_vaccinations_per_hundred ? parseFloat(row.total_vaccinations_per_hundred) : null,
            peopleVaccinatedPerHundred: row.people_vaccinated_per_hundred ? parseFloat(row.people_vaccinated_per_hundred) : null,
            peopleFullyVaccinatedPerHundred: row.people_fully_vaccinated_per_hundred ? parseFloat(row.people_fully_vaccinated_per_hundred) : null,
            totalBoostersPerHundred: row.total_boosters_per_hundred ? parseFloat(row.total_boosters_per_hundred) : null,
            dailyPeopleVaccinatedSmoothedPerHundred: row.daily_people_vaccinated_smoothed_per_hundred ? parseFloat(row.daily_people_vaccinated_smoothed_per_hundred) : null,
            dailyVaccinationsSmoothedPerMillion: row.daily_vaccinations_smoothed_per_million ? parseFloat(row.daily_vaccinations_smoothed_per_million) : null,
            peopleUnvaccinated: row.people_unvaccinated ? parseFloat(row.people_unvaccinated) : null,
            shareOfBoosters: row.share_of_boosters ? parseFloat(row.share_of_boosters) : null,
            totalVaccinationsInterpolated: row.total_vaccinations_interpolated ? parseFloat(row.total_vaccinations_interpolated) : null,
            peopleVaccinatedInterpolated: row.people_vaccinated_interpolated ? parseFloat(row.people_vaccinated_interpolated) : null,
            peopleFullyVaccinatedInterpolated: row.people_fully_vaccinated_interpolated ? parseFloat(row.people_fully_vaccinated_interpolated) : null,
            totalBoostersInterpolated: row.total_boosters_interpolated ? parseFloat(row.total_boosters_interpolated) : null,
            totalVaccinationsNoBoostersInterpolated: row.total_vaccinations_no_boosters_interpolated ? parseFloat(row.total_vaccinations_no_boosters_interpolated) : null,
            totalVaccinationsNoBoostersPerHundredInterpolated: row.total_vaccinations_no_boosters_per_hundred_interpolated ? parseFloat(row.total_vaccinations_no_boosters_per_hundred_interpolated) : null,
            rollingVaccinations6m: row.rolling_vaccinations_6m ? parseFloat(row.rolling_vaccinations_6m) : null,
            rollingVaccinations6mPerHundred: row.rolling_vaccinations_6m_per_hundred ? parseFloat(row.rolling_vaccinations_6m_per_hundred) : null,
            rollingVaccinations9m: row.rolling_vaccinations_9m ? parseFloat(row.rolling_vaccinations_9m) : null,
            rollingVaccinations9mPerHundred: row.rolling_vaccinations_9m_per_hundred ? parseFloat(row.rolling_vaccinations_9m_per_hundred) : null,
            rollingVaccinations12m: row.rolling_vaccinations_12m ? parseFloat(row.rolling_vaccinations_12m) : null,
            rollingVaccinations12mPerHundred: row.rolling_vaccinations_12m_per_hundred ? parseFloat(row.rolling_vaccinations_12m_per_hundred) : null,
            countryId: countryMap.get(row.country.toLowerCase().trim())
          }));

        if (validRecords.length > 0) {
          const result = await prisma.vaccination.createMany({
            data: validRecords,
            skipDuplicates: true
          });
          successCount += result.count;
        }

        processedCount += records.length;
        progressBar.update(processedCount);
      } catch (error) {
        console.error('Error processing batch:', error);
      }
    };

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        currentBatch.push(row);

        if (currentBatch.length >= BATCH_SIZE) {
          const batchToProcess = [...currentBatch];
          currentBatch = [];
          await processBatch(batchToProcess);
        }
      })
      .on('end', async () => {
        try {
          if (currentBatch.length > 0) {
            await processBatch(currentBatch);
          }

          await prisma.$disconnect();
          resolve({ processed: processedCount, inserted: successCount });
        } catch (error) {
          await prisma.$disconnect();
          reject(error);
        }
      })
      .on('error', async (error) => {
        await prisma.$disconnect();
        reject(error);
      });
  });
}

module.exports = importVaccinations;