/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Blogs` table. All the data in the column will be lost.
  - You are about to drop the column `categoryCategoryId` on the `BlogsOnCommunity` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Blogs" DROP CONSTRAINT "Blogs_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "BlogsOnCommunity" DROP CONSTRAINT "BlogsOnCommunity_categoryCategoryId_fkey";

-- AlterTable
ALTER TABLE "Blogs" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "BlogsOnCommunity" DROP COLUMN "categoryCategoryId";

-- CreateTable
CREATE TABLE "CategoryOnBlogs" (
    "blogUserId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "CategoryOnBlogs_pkey" PRIMARY KEY ("blogUserId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoryOnBlogs" ADD CONSTRAINT "CategoryOnBlogs_blogUserId_fkey" FOREIGN KEY ("blogUserId") REFERENCES "Blogs"("blogId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnBlogs" ADD CONSTRAINT "CategoryOnBlogs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
