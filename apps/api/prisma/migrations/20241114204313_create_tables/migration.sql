-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iso_code" TEXT NOT NULL,
    "continent" TEXT,
    "population" INTEGER,
    "population_density" DOUBLE PRECISION,
    "median_age" DOUBLE PRECISION,
    "aged_65_older" DOUBLE PRECISION,
    "aged_70_older" DOUBLE PRECISION,
    "gdp_per_capita" DOUBLE PRECISION,
    "extreme_poverty" DOUBLE PRECISION,
    "cardiovasc_death_rate" DOUBLE PRECISION,
    "diabetes_prevalence" DOUBLE PRECISION,
    "female_smokers" DOUBLE PRECISION,
    "male_smokers" DOUBLE PRECISION,
    "handwashing_facilities" DOUBLE PRECISION,
    "hospital_beds_per_thousand" DOUBLE PRECISION,
    "life_expectancy" DOUBLE PRECISION,
    "human_development_index" DOUBLE PRECISION,
    "income_group" TEXT,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "covid_cases" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "new_cases" INTEGER,
    "total_cases" INTEGER,
    "new_deaths" INTEGER,
    "total_deaths" INTEGER,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "covid_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccinations" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "total_vaccinations" DOUBLE PRECISION,
    "people_vaccinated" DOUBLE PRECISION,
    "people_fully_vaccinated" DOUBLE PRECISION,
    "total_boosters" DOUBLE PRECISION,
    "daily_vaccinations" DOUBLE PRECISION,
    "daily_vaccinations_smoothed" DOUBLE PRECISION,
    "daily_people_vaccinated_smoothed" DOUBLE PRECISION,
    "total_vaccinations_per_hundred" DOUBLE PRECISION,
    "people_vaccinated_per_hundred" DOUBLE PRECISION,
    "people_fully_vaccinated_per_hundred" DOUBLE PRECISION,
    "total_boosters_per_hundred" DOUBLE PRECISION,
    "daily_people_vaccinated_smoothed_per_hundred" DOUBLE PRECISION,
    "daily_vaccinations_smoothed_per_million" DOUBLE PRECISION,
    "people_unvaccinated" DOUBLE PRECISION,
    "share_of_boosters" DOUBLE PRECISION,
    "total_vaccinations_interpolated" DOUBLE PRECISION,
    "people_vaccinated_interpolated" DOUBLE PRECISION,
    "people_fully_vaccinated_interpolated" DOUBLE PRECISION,
    "total_boosters_interpolated" DOUBLE PRECISION,
    "total_vaccinations_no_boosters_interpolated" DOUBLE PRECISION,
    "total_vaccinations_no_boosters_per_hundred_interpolated" DOUBLE PRECISION,
    "rolling_vaccinations_6m" DOUBLE PRECISION,
    "rolling_vaccinations_6m_per_hundred" DOUBLE PRECISION,
    "rolling_vaccinations_9m" DOUBLE PRECISION,
    "rolling_vaccinations_9m_per_hundred" DOUBLE PRECISION,
    "rolling_vaccinations_12m" DOUBLE PRECISION,
    "rolling_vaccinations_12m_per_hundred" DOUBLE PRECISION,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "vaccinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccinations_by_age" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "age_group" TEXT NOT NULL,
    "people_vaccinated_per_hundred" DOUBLE PRECISION,
    "people_fully_vaccinated_per_hundred" DOUBLE PRECISION,
    "people_with_booster_per_hundred" DOUBLE PRECISION,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "vaccinations_by_age_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccinations_by_manufacturer" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "vaccine" TEXT NOT NULL,
    "total_vaccinations" INTEGER,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "vaccinations_by_manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lives_expectancy" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "lifeExpectancy" DOUBLE PRECISION NOT NULL,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "lives_expectancy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso_code_key" ON "countries"("iso_code");

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
