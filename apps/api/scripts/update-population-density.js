const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function updatePopulationDensity() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/population_density.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          await prisma.country.updateMany({
            where: { isoCode: row.iso_code },
            data: { populationDensity: parseFloat(row.population_density) || null },
          });
        } catch (error) {
          console.error(`Error on updatePopulationDensity for ${row.location}: ${error.message}`);
        }
      }
      await prisma.$disconnect();
    });
}

module.exports = updatePopulationDensity;
