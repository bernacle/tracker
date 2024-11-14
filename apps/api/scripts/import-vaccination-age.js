const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function importVaccinationAge() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/vaccination_age.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          const country = await prisma.country.findUnique({
            where: { name: row.country },
          });

          if (country) {
            await prisma.vaccinationByAge.create({
              data: {
                date: new Date(row.date),
                ageGroup: row.age_group,
                peopleVaccinatedPerHundred: parseFloat(row.people_vaccinated_per_hundred) || null,
                peopleFullyVaccinatedPerHundred: parseFloat(row.people_fully_vaccinated_per_hundred) || null,
                peopleWithBoosterPerHundred: parseFloat(row.people_with_booster_per_hundred) || null,
                countryId: country.id,
              },
            });
          } else {
            console.warn(`Country not found: ${row.country}`);
          }
        } catch (error) {
          console.error(`Error on importVaccinationAge for: ${row.country}: ${error.message}`);
        }
      }
      console.log('importVaccinationAge completed.');
      await prisma.$disconnect();
    });
}

importVaccinationAge();
