const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function updateAged65Older() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/aged_65_older.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          await prisma.country.updateMany({
            where: { isoCode: row.iso_code },
            data: { aged65Older: parseFloat(row.aged_65_older) || null },
          });
        } catch (error) {
          console.error(`Error updating aged 65 older for ${row.location}: ${error.message}`);
        }
      }
      console.log('Aged 65+ data update completed.');
      await prisma.$disconnect();
    });
}

updateAged65Older();
