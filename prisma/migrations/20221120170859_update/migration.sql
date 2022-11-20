/*
  Warnings:

  - You are about to drop the column `popularity` on the `Community` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Community" DROP COLUMN "popularity",
ADD COLUMN     "communityImage" TEXT NOT NULL DEFAULT E'https://thumbs.dreamstime.com/z/people-line-icon-team-outline-logo-illustration-linear-pictogram-isolated-white-90235968.jpg';
