const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function importVaccinations() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/vaccinations.csv');

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
            await prisma.vaccination.create({
              data: {
                date: new Date(row.date),
                totalVaccinations: parseFloat(row.total_vaccinations) || null,
                peopleVaccinated: parseFloat(row.people_vaccinated) || null,
                peopleFullyVaccinated: parseFloat(row.people_fully_vaccinated) || null,
                totalBoosters: parseFloat(row.total_boosters) || null,
                dailyVaccinations: parseFloat(row.daily_vaccinations) || null,
                dailyVaccinationsSmoothed: parseFloat(row.daily_vaccinations_smoothed) || null,
                dailyPeopleVaccinatedSmoothed: parseFloat(row.daily_people_vaccinated_smoothed) || null,
                totalVaccinationsPerHundred: parseFloat(row.total_vaccinations_per_hundred) || null,
                peopleVaccinatedPerHundred: parseFloat(row.people_vaccinated_per_hundred) || null,
                peopleFullyVaccinatedPerHundred: parseFloat(row.people_fully_vaccinated_per_hundred) || null,
                totalBoostersPerHundred: parseFloat(row.total_boosters_per_hundred) || null,
                dailyPeopleVaccinatedSmoothedPerHundred: parseFloat(row.daily_people_vaccinated_smoothed_per_hundred) || null,
                dailyVaccinationsSmoothedPerMillion: parseFloat(row.daily_vaccinations_smoothed_per_million) || null,
                peopleUnvaccinated: parseFloat(row.people_unvaccinated) || null,
                shareOfBoosters: parseFloat(row.share_of_boosters) || null,
                totalVaccinationsInterpolated: parseFloat(row.total_vaccinations_interpolated) || null,
                peopleVaccinatedInterpolated: parseFloat(row.people_vaccinated_interpolated) || null,
                peopleFullyVaccinatedInterpolated: parseFloat(row.people_fully_vaccinated_interpolated) || null,
                totalBoostersInterpolated: parseFloat(row.total_boosters_interpolated) || null,
                totalVaccinationsNoBoostersInterpolated: parseFloat(row.total_vaccinations_no_boosters_interpolated) || null,
                totalVaccinationsNoBoostersPerHundredInterpolated: parseFloat(row.total_vaccinations_no_boosters_per_hundred_interpolated) || null,
                rollingVaccinations6m: parseFloat(row.rolling_vaccinations_6m) || null,
                rollingVaccinations6mPerHundred: parseFloat(row.rolling_vaccinations_6m_per_hundred) || null,
                rollingVaccinations9m: parseFloat(row.rolling_vaccinations_9m) || null,
                rollingVaccinations9mPerHundred: parseFloat(row.rolling_vaccinations_9m_per_hundred) || null,
                rollingVaccinations12m: parseFloat(row.rolling_vaccinations_12m) || null,
                rollingVaccinations12mPerHundred: parseFloat(row.rolling_vaccinations_12m_per_hundred) || null,
                countryId: country.id,
              },
            });
          }
        } catch (error) {
          console.error(`Error on importVaccinations for ${row.country}: ${error.message}`);
        }
      }
      console.log('importVaccinations completed.');
      await prisma.$disconnect();
    });
}

importVaccinations();
