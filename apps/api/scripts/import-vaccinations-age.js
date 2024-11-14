const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const multibar = require('./progress-bar');

const prisma = new PrismaClient({
  log: ['error']
});

async function importVaccinationAge() {
  return new Promise(async (resolve, reject) => {
    const BATCH_SIZE = 1000;
    let processedCount = 0;
    let successCount = 0;
    const filePath = path.join(__dirname, '../data/csv/vaccinations_age.csv');

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

    const progressBar = multibar.create(totalRecords, 0, { title: 'Vacc. by Age' });
    let currentBatch = [];

    const processBatch = async (batch) => {
      try {
        const validRecords = batch
          .filter(row => countryMap.has(row.country.toLowerCase().trim()))
          .map(row => ({
            date: new Date(row.date),
            ageGroup: row.age_group,
            peopleVaccinatedPerHundred: parseFloat(row.people_vaccinated_per_hundred) || null,
            peopleFullyVaccinatedPerHundred: parseFloat(row.people_fully_vaccinated_per_hundred) || null,
            peopleWithBoosterPerHundred: parseFloat(row.people_with_booster_per_hundred) || null,
            countryId: countryMap.get(row.country.toLowerCase().trim())
          }));

        if (validRecords.length > 0) {
          const result = await prisma.vaccinationByAge.createMany({
            data: validRecords,
            skipDuplicates: true
          });
          successCount += result.count;
        }

        processedCount += batch.length;
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

module.exports = importVaccinationAge;