/*
  Warnings:

  - You are about to drop the column `content` on the `DiscussComment` table. All the data in the column will be lost.
  - Added the required column `context` to the `DiscussComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `DiscussPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscussComment" DROP COLUMN "content",
ADD COLUMN     "context" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DiscussPost" ADD COLUMN     "File" TEXT,
ADD COLUMN     "content" TEXT NOT NULL;
