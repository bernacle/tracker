const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const multibar = require('./progress-bar');

const prisma = new PrismaClient({
  log: ['error']
});

async function importCovidCases() {
  return new Promise(async (resolve, reject) => {
    const BATCH_SIZE = 1000;
    let processedCount = 0;
    let successCount = 0;
    const filePath = path.join(__dirname, '../data/csv/cases_deaths.csv');

    const countries = await prisma.country.findMany();
    if (countries.length === 0) {
      throw new Error('No countries found in database');
    }

    const countryMap = new Map();
    for (const country of countries) {
      countryMap.set(country.name.toLowerCase().trim(), country.id);
    }

    const totalRecords = await new Promise((resolve) => {
      let count = 0;
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', () => count++)
        .on('end', () => resolve(count));
    });

    const progressBar = multibar.create(totalRecords, 0, { title: 'COVID Cases' });
    let currentBatch = [];

    const processBatch = async (batch) => {
      try {
        const validRecords = batch
          .filter(item => countryMap.has(item.country.toLowerCase().trim()))
          .map(item => ({
            date: new Date(item.date),
            newCases: item.new_cases ? parseInt(item.new_cases) : null,
            totalCases: item.total_cases ? parseInt(item.total_cases) : null,
            newDeaths: item.new_deaths ? parseInt(item.new_deaths) : null,
            totalDeaths: item.total_deaths ? parseInt(item.total_deaths) : null,
            countryId: countryMap.get(item.country.toLowerCase().trim())
          }));

        if (validRecords.length > 0) {
          const result = await prisma.covidCase.createMany({
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

module.exports = importCovidCases;