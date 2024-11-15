/*
  Warnings:

  - You are about to drop the column `aged_70_older` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `life_expectancy` on the `countries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "countries" DROP COLUMN "aged_70_older",
DROP COLUMN "life_expectancy";
