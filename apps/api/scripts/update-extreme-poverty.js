const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function updateExtremePoverty() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/extreme_poverty.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          await prisma.country.updateMany({
            where: { isoCode: row.iso_code },
            data: { extremePoverty: parseFloat(row.extreme_poverty) || null },
          });
        } catch (error) {
          console.error(`Error on updateExtremePoverty for ${row.location}: ${error.message}`);
        }
      }
      console.log('updateExtremePoverty completed.');
      await prisma.$disconnect();
    });
}

updateExtremePoverty();
