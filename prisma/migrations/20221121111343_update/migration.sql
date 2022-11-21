-- AlterTable
ALTER TABLE "Blogs" ADD COLUMN     "isSpacial" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CategoryOnBlogsCommunity" (
    "blogUserId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "CategoryOnBlogsCommunity_pkey" PRIMARY KEY ("blogUserId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoryOnBlogsCommunity" ADD CONSTRAINT "CategoryOnBlogsCommunity_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnBlogsCommunity" ADD CONSTRAINT "CategoryOnBlogsCommunity_blogUserId_fkey" FOREIGN KEY ("blogUserId") REFERENCES "BlogsOnCommunity"("blogId") ON DELETE RESTRICT ON UPDATE CASCADE;
