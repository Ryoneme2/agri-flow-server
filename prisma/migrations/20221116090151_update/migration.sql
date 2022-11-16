-- AlterTable
ALTER TABLE "Blogs" ADD COLUMN     "categoryId" INTEGER;

-- CreateTable
CREATE TABLE "UserReadBlog" (
    "usersUsername" TEXT,
    "blogType" TEXT NOT NULL,
    "blogId" INTEGER NOT NULL,

    CONSTRAINT "UserReadBlog_pkey" PRIMARY KEY ("blogId","blogType")
);

-- CreateTable
CREATE TABLE "Category" (
    "categoryId" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- AddForeignKey
ALTER TABLE "UserReadBlog" ADD CONSTRAINT "UserReadBlog_usersUsername_fkey" FOREIGN KEY ("usersUsername") REFERENCES "Users"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE SET NULL ON UPDATE CASCADE;
