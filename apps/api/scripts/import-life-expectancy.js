const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const multibar = require('./progress-bar');

const prisma = new PrismaClient({
  log: ['error']
});

async function importLifeExpectancy() {
  return new Promise(async (resolve, reject) => {
    const BATCH_SIZE = 1000;
    let processedCount = 0;
    let successCount = 0;
    const filePath = path.join(__dirname, '../data/csv/life_expectancy.csv');

    const countries = await prisma.country.findMany();
    const countryMap = new Map(
      countries.map(country => [country.isoCode, country.id])
    );

    const totalRecords = await new Promise((resolve) => {
      let count = 0;
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', () => count++)
        .on('end', () => resolve(count));
    });

    const progressBar = multibar.create(totalRecords, 0, { title: 'Life Expectancy' });
    let currentBatch = [];

    const processBatch = async (batch) => {
      try {
        const validRecords = batch
          .filter(row => countryMap.has(row.Code))
          .map(row => ({
            year: parseInt(row.Year),
            lifeExpectancy: parseFloat(row['Period life expectancy at birth - Sex: all - Age: 0']) || null,
            countryId: countryMap.get(row.Code)
          }));

        if (validRecords.length > 0) {
          const result = await prisma.lifeExpectancy.createMany({
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

module.exports = importLifeExpectancy;