const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function importCountries() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/countries.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          await prisma.country.create({
            data: {
              name: row.owid,
              isoCode: row.iso3,
            },
          });
        } catch (error) {
          console.error(`Error on importCountries for ${row.owid}: ${error.message}`);
        }
      }
      console.log('Initial importCountries completed.');
      await prisma.$disconnect();
    });
}

importCountries();
