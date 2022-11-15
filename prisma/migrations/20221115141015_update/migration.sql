/*
  Warnings:

  - Added the required column `context` to the `BlogComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `context` to the `BlogCommunityComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogComment" ADD COLUMN     "context" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BlogCommunityComment" ADD COLUMN     "context" TEXT NOT NULL;
