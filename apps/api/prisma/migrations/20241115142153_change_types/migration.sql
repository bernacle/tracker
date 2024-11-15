/*
  Warnings:

  - The primary key for the `countries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `covid_cases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `lives_expectancy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vaccinations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vaccinations_by_age` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vaccinations_by_manufacturer` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "covid_cases" DROP CONSTRAINT "covid_cases_country_id_fkey";

-- DropForeignKey
ALTER TABLE "lives_expectancy" DROP CONSTRAINT "lives_expectancy_country_id_fkey";

-- DropForeignKey
ALTER TABLE "vaccinations" DROP CONSTRAINT "vaccinations_country_id_fkey";

-- DropForeignKey
ALTER TABLE "vaccinations_by_age" DROP CONSTRAINT "vaccinations_by_age_country_id_fkey";

-- DropForeignKey
ALTER TABLE "vaccinations_by_manufacturer" DROP CONSTRAINT "vaccinations_by_manufacturer_country_id_fkey";

-- AlterTable
ALTER TABLE "countries" DROP CONSTRAINT "countries_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "countries_id_seq";

-- AlterTable
ALTER TABLE "covid_cases" DROP CONSTRAINT "covid_cases_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "country_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "covid_cases_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "covid_cases_id_seq";

-- AlterTable
ALTER TABLE "lives_expectancy" DROP CONSTRAINT "lives_expectancy_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "country_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "lives_expectancy_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "lives_expectancy_id_seq";

-- AlterTable
ALTER TABLE "vaccinations" DROP CONSTRAINT "vaccinations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "country_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "vaccinations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "vaccinations_id_seq";

-- AlterTable
ALTER TABLE "vaccinations_by_age" DROP CONSTRAINT "vaccinations_by_age_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "country_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "vaccinations_by_age_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "vaccinations_by_age_id_seq";

-- AlterTable
ALTER TABLE "vaccinations_by_manufacturer" DROP CONSTRAINT "vaccinations_by_manufacturer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "country_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "vaccinations_by_manufacturer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "vaccinations_by_manufacturer_id_seq";

-- AddForeignKey
ALTER TABLE "covid_cases" ADD CONSTRAINT "covid_cases_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccinations_by_age" ADD CONSTRAINT "vaccinations_by_age_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccinations_by_manufacturer" ADD CONSTRAINT "vaccinations_by_manufacturer_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lives_expectancy" ADD CONSTRAINT "lives_expectancy_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
