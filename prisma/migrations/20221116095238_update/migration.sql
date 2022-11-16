/*
  Warnings:

  - You are about to drop the `UserReadBlog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserReadBlog" DROP CONSTRAINT "UserReadBlog_usersUsername_fkey";

-- AlterTable
ALTER TABLE "Blogs" ADD COLUMN     "userReadBlogPersonBlogId" INTEGER;

-- AlterTable
ALTER TABLE "BlogsOnCommunity" ADD COLUMN     "userReadBlogCommunityBlogId" INTEGER;

-- DropTable
DROP TABLE "UserReadBlog";

-- CreateTable
CREATE TABLE "UserReadBlogPerson" (
    "usersUsername" TEXT,
    "blogId" SERIAL NOT NULL,

    CONSTRAINT "UserReadBlogPerson_pkey" PRIMARY KEY ("blogId")
);

-- CreateTable
CREATE TABLE "UserReadBlogCommunity" (
    "usersUsername" TEXT,
    "blogId" SERIAL NOT NULL,

    CONSTRAINT "UserReadBlogCommunity_pkey" PRIMARY KEY ("blogId")
);

-- AddForeignKey
ALTER TABLE "UserReadBlogPerson" ADD CONSTRAINT "UserReadBlogPerson_usersUsername_fkey" FOREIGN KEY ("usersUsername") REFERENCES "Users"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReadBlogCommunity" ADD CONSTRAINT "UserReadBlogCommunity_usersUsername_fkey" FOREIGN KEY ("usersUsername") REFERENCES "Users"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_userReadBlogPersonBlogId_fkey" FOREIGN KEY ("userReadBlogPersonBlogId") REFERENCES "UserReadBlogPerson"("blogId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogsOnCommunity" ADD CONSTRAINT "BlogsOnCommunity_userReadBlogCommunityBlogId_fkey" FOREIGN KEY ("userReadBlogCommunityBlogId") REFERENCES "UserReadBlogCommunity"("blogId") ON DELETE SET NULL ON UPDATE CASCADE;
