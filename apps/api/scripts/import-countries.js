const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cliProgress = require('cli-progress');

const prisma = new PrismaClient({
  log: ['error']
});

async function importCountries() {
  return new Promise(async (resolve, reject) => {
    const records = [];
    const filePath = path.join(__dirname, '../data/csv/countries.csv');
    let processedCount = 0;
    let insertedCount = 0;

    const totalRecords = await new Promise((countResolve) => {
      let count = 0;
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', () => count++)
        .on('end', () => countResolve(count));
    });

    const progressBar = new cliProgress.SingleBar({
      format: 'Importing Countries |{bar}| {percentage}% || {value}/{total}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });

    progressBar.start(totalRecords, 0);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => records.push(data))
      .on('end', async () => {
        try {
          for (const row of records) {
            const countryName = row.owid ? row.owid.toLowerCase().trim() : null;
            const isoCode = row.iso3 ? row.iso3.toUpperCase().trim() : null;

            if (isoCode && countryName) {
              try {
                const existingCountry = await prisma.country.findFirst({
                  where: { isoCode: isoCode },
                });

                if (!existingCountry) {
                  await prisma.country.create({
                    data: {
                      name: countryName,
                      isoCode: isoCode,
                    },
                  });
                  insertedCount++;
                }

                processedCount++;
                progressBar.update(processedCount);

              } catch (error) {
                if (!error.message.includes('Unique constraint')) {
                  console.error(`Error: ${isoCode} - ${error.message}`);
                }
              }
            }
          }

          progressBar.stop();

          await prisma.$disconnect();
          resolve();
        } catch (error) {
          progressBar.stop();
          reject(error);
        }
      })
      .on('error', (error) => {
        progressBar.stop();
        reject(error);
      });
  });
}

module.exports = importCountries;