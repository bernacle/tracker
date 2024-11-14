const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function importCovidCases() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/cases_deaths.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          const country = await prisma.country.findUnique({
            where: { isoCode: row.country },
          });

          if (country) {
            await prisma.covidCase.create({
              data: {
                date: new Date(row.date),
                newCases: parseInt(row.new_cases) || null,
                totalCases: parseInt(row.total_cases) || null,
                newDeaths: parseInt(row.new_deaths) || null,
                totalDeaths: parseInt(row.total_deaths) || null,
                countryId: country.id,
              },
            });
          }
        } catch (error) {
          console.error(`Error on importCovidCases for ${row.country}: ${error.message}`);
        }
      }
      console.log('importCovidCases completed.');
      await prisma.$disconnect();
    });
}

importCovidCases();
