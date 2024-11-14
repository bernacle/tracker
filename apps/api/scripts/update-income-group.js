const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function updateIncomeGroup() {
  const records = [];
  const filePath = path.join(__dirname, '../data/csv/income_groups.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const row of records) {
        try {
          await prisma.country.updateMany({
            where: { isoCode: row.Code },
            data: { incomeGroup: row['Income group'] || null },
          });
        } catch (error) {
          console.error(`Error on updateIncomeGroup for ${row.Country}: ${error.message}`);
        }
      }
      await prisma.$disconnect();
    });
}

module.exports = updateIncomeGroup;

