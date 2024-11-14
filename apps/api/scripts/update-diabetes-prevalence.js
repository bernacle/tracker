const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function updateDiabetesPrevalence() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/diabetes_prevalence.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          await prisma.country.updateMany({
            where: { isoCode: row.iso_code },
            data: { diabetesPrevalence: parseFloat(row.diabetes_prevalence) || null },
          });
        } catch (error) {
          console.error(`Error on updateDiabetesPrevalence for ${row.location}: ${error.message}`);
        }
      }
      console.log('updateDiabetesPrevalence completed.');
      await prisma.$disconnect();
    });
}

updateDiabetesPrevalence();
