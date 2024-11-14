const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function updateMaleSmokers() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/male_smokers.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          await prisma.country.updateMany({
            where: { isoCode: row.iso_code },
            data: { maleSmokers: parseFloat(row.male_smokers) || null },
          });
        } catch (error) {
          console.error(`Error on updateMaleSmokers for ${row.location}: ${error.message}`);
        }
      }
      console.log('updateMaleSmokers completed.');
      await prisma.$disconnect();
    });
}

updateMaleSmokers();
