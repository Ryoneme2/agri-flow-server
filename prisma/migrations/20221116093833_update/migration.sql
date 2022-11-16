-- AlterTable
ALTER TABLE "BlogsOnCommunity" ADD COLUMN     "categoryCategoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "BlogsOnCommunity" ADD CONSTRAINT "BlogsOnCommunity_categoryCategoryId_fkey" FOREIGN KEY ("categoryCategoryId") REFERENCES "Category"("categoryId") ON DELETE SET NULL ON UPDATE CASCADE;
