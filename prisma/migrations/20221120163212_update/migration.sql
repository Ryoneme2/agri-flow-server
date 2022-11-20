/*
  Warnings:

  - You are about to drop the column `usersUsername` on the `Community` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Community" DROP CONSTRAINT "Community_usersUsername_fkey";

-- AlterTable
ALTER TABLE "Community" DROP COLUMN "usersUsername";

-- CreateTable
CREATE TABLE "UserInCommunity" (
    "username" TEXT NOT NULL,
    "commuId" TEXT NOT NULL,

    CONSTRAINT "UserInCommunity_pkey" PRIMARY KEY ("username","commuId")
);

-- AddForeignKey
ALTER TABLE "UserInCommunity" ADD CONSTRAINT "UserInCommunity_username_fkey" FOREIGN KEY ("username") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInCommunity" ADD CONSTRAINT "UserInCommunity_commuId_fkey" FOREIGN KEY ("commuId") REFERENCES "Community"("commuId") ON DELETE RESTRICT ON UPDATE CASCADE;
