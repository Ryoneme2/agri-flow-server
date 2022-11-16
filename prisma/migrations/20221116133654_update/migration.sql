/*
  Warnings:

  - You are about to drop the column `userReadBlogPersonBlogId` on the `Blogs` table. All the data in the column will be lost.
  - The primary key for the `UserReadBlogPerson` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `blogId` on the `UserReadBlogPerson` table. All the data in the column will be lost.
  - Added the required column `BlogId` to the `UserReadBlogPerson` table without a default value. This is not possible if the table is not empty.
  - Made the column `usersUsername` on table `UserReadBlogPerson` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Blogs" DROP CONSTRAINT "Blogs_userReadBlogPersonBlogId_fkey";

-- DropForeignKey
ALTER TABLE "UserReadBlogPerson" DROP CONSTRAINT "UserReadBlogPerson_usersUsername_fkey";

-- AlterTable
ALTER TABLE "Blogs" DROP COLUMN "userReadBlogPersonBlogId";

-- AlterTable
ALTER TABLE "UserReadBlogPerson" DROP CONSTRAINT "UserReadBlogPerson_pkey",
DROP COLUMN "blogId",
ADD COLUMN     "BlogId" INTEGER NOT NULL,
ALTER COLUMN "usersUsername" SET NOT NULL,
ADD CONSTRAINT "UserReadBlogPerson_pkey" PRIMARY KEY ("usersUsername", "BlogId");

-- AddForeignKey
ALTER TABLE "UserReadBlogPerson" ADD CONSTRAINT "UserReadBlogPerson_usersUsername_fkey" FOREIGN KEY ("usersUsername") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReadBlogPerson" ADD CONSTRAINT "UserReadBlogPerson_BlogId_fkey" FOREIGN KEY ("BlogId") REFERENCES "Blogs"("blogId") ON DELETE RESTRICT ON UPDATE CASCADE;
