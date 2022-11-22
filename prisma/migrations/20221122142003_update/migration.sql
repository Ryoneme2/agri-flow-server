-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "Bio" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "Facebook" TEXT,
ADD COLUMN     "Line" TEXT;
