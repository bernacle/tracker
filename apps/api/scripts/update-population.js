const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function updatePopulation() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/population.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          await prisma.country.updateMany({
            where: { isoCode: row.iso_code },
            data: { population: parseFloat(row.population) || null },
          });
        } catch (error) {
          console.error(`Error on updatePopulation for ${row.entity}: ${error.message}`);
        }
      }
      await prisma.$disconnect();
    });
}

module.exports = updatePopulation;
