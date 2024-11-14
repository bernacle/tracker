const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function updateGdpPerCapita() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/gdp_per_capita.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          await prisma.country.updateMany({
            where: { isoCode: row.iso_code },
            data: { gdpPerCapita: parseFloat(row.gdp_per_capita) || null },
          });
        } catch (error) {
          console.error(`Error on updateGdpPerCapita for ${row.location}: ${error.message}`);
        }
      }
      await prisma.$disconnect();
    });
}

module.exports = updateGdpPerCapita;

