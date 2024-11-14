const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function importLifeExpectancy() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/life_expectancy.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          const country = await prisma.country.findUnique({
            where: { isoCode: row.Code },
          });

          if (country) {
            await prisma.lifeExpectancy.create({
              data: {
                year: parseInt(row.Year),
                lifeExpectancy: parseFloat(row['Period life expectancy at birth - Sex: all - Age: 0']) || null,
                countryId: country.id,
              },
            });
          }
        } catch (error) {
          console.error(`Error on importLifeExpectancy for ${row.Entity}: ${error.message}`);
        }
      }
      console.log('importLifeExpectancy completed.');
      await prisma.$disconnect();
    });
}

importLifeExpectancy();
