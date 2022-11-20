-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "create_by" TEXT;

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_create_by_fkey" FOREIGN KEY ("create_by") REFERENCES "Users"("username") ON DELETE SET NULL ON UPDATE CASCADE;
