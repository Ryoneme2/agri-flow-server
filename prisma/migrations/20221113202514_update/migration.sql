/*
  Warnings:

  - Added the required column `title` to the `Blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `BlogsOnCommunity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blogs" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BlogsOnCommunity" ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Follows" (
    "followerUser" TEXT NOT NULL,
    "followingUser" TEXT NOT NULL,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerUser","followingUser")
);

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerUser_fkey" FOREIGN KEY ("followerUser") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingUser_fkey" FOREIGN KEY ("followingUser") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
