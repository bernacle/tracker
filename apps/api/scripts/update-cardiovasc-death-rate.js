const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function updateCardiovascDeathRate() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/cardiovasc_death_rate.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          await prisma.country.updateMany({
            where: { isoCode: row.iso_code },
            data: { cardiovascDeathRate: parseFloat(row.cardiovasc_death_rate) || null },
          });
        } catch (error) {
          console.error(`Error on updateHandwashingFacilities for ${row.location}: ${error.message}`);
        }
      }
      await prisma.$disconnect();
    });
}

module.exports = updateCardiovascDeathRate;
