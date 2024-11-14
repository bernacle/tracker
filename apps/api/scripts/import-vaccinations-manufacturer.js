const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function importVaccinationsManufacturer() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/vaccinations_manufacturer.csv');

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
            await prisma.vaccinationByManufacturer.create({
              data: {
                date: new Date(row.date),
                vaccine: row.vaccine,
                totalVaccinations: parseInt(row.total_vaccinations) || null,
                countryId: country.id,
              },
            });
          } else {
            console.warn(`Country not found: ${row.country}`);
          }
        } catch (error) {
          console.error(`Error on importVaccinationsManufacturer for: ${row.country}: ${error.message}`);
        }
      }
      console.log('importVaccinationsManufacturer completed.');
      await prisma.$disconnect();
    });
}

importVaccinationsManufacturer();
