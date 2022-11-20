-- CreateTable
CREATE TABLE "CategoryOnDiscuss" (
    "postId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "CategoryOnDiscuss_pkey" PRIMARY KEY ("postId","categoryId")
);

-- CreateTable
CREATE TABLE "LikeBy" (
    "postsId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "LikeBy_pkey" PRIMARY KEY ("username","postsId")
);

-- AddForeignKey
ALTER TABLE "CategoryOnDiscuss" ADD CONSTRAINT "CategoryOnDiscuss_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnDiscuss" ADD CONSTRAINT "CategoryOnDiscuss_postId_fkey" FOREIGN KEY ("postId") REFERENCES "DiscussPost"("dcpId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBy" ADD CONSTRAINT "LikeBy_username_fkey" FOREIGN KEY ("username") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBy" ADD CONSTRAINT "LikeBy_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "DiscussPost"("dcpId") ON DELETE RESTRICT ON UPDATE CASCADE;
