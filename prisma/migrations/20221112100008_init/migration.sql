-- CreateTable
CREATE TABLE "Users" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT E'',
    "lastName" TEXT NOT NULL DEFAULT E'',
    "password" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "isVerify" BOOLEAN NOT NULL DEFAULT false,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Blogs" (
    "blogId" SERIAL NOT NULL,
    "usersUsername" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blogs_pkey" PRIMARY KEY ("blogId")
);

-- CreateTable
CREATE TABLE "DiscussPost" (
    "dcpId" SERIAL NOT NULL,
    "usersUsername" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscussPost_pkey" PRIMARY KEY ("dcpId")
);

-- CreateTable
CREATE TABLE "Community" (
    "commuId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL,
    "usersUsername" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("commuId")
);

-- CreateTable
CREATE TABLE "BlogsOnCommunity" (
    "blogId" SERIAL NOT NULL,
    "usersUsername" TEXT NOT NULL,
    "communityCommuId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogsOnCommunity_pkey" PRIMARY KEY ("blogId")
);

-- CreateTable
CREATE TABLE "BlogComment" (
    "id" SERIAL NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blogsBlogId" INTEGER NOT NULL,
    "usersUsername" TEXT NOT NULL,

    CONSTRAINT "BlogComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCommunityComment" (
    "id" SERIAL NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersUsername" TEXT NOT NULL,
    "blogsOnCommunityBlogId" INTEGER NOT NULL,

    CONSTRAINT "BlogCommunityComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussComment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersUsername" TEXT NOT NULL,
    "discussPostDcpId" INTEGER NOT NULL,

    CONSTRAINT "DiscussComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_usersUsername_fkey" FOREIGN KEY ("usersUsername") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPost" ADD CONSTRAINT "DiscussPost_usersUsername_fkey" FOREIGN KEY ("usersUsername") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_usersUsername_fkey" FOREIGN KEY ("usersUsername") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogsOnCommunity" ADD CONSTRAINT "BlogsOnCommunity_usersUsername_fkey" FOREIGN KEY ("usersUsername") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogsOnCommunity" ADD CONSTRAINT "BlogsOnCommunity_communityCommuId_fkey" FOREIGN KEY ("communityCommuId") REFERENCES "Community"("commuId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_usersUsername_fkey" FOREIGN KEY ("usersUsername") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_blogsBlogId_fkey" FOREIGN KEY ("blogsBlogId") REFERENCES "Blogs"("blogId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCommunityComment" ADD CONSTRAINT "BlogCommunityComment_usersUsername_fkey" FOREIGN KEY ("usersUsername") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCommunityComment" ADD CONSTRAINT "BlogCommunityComment_blogsOnCommunityBlogId_fkey" FOREIGN KEY ("blogsOnCommunityBlogId") REFERENCES "BlogsOnCommunity"("blogId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussComment" ADD CONSTRAINT "DiscussComment_usersUsername_fkey" FOREIGN KEY ("usersUsername") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussComment" ADD CONSTRAINT "DiscussComment_discussPostDcpId_fkey" FOREIGN KEY ("discussPostDcpId") REFERENCES "DiscussPost"("dcpId") ON DELETE RESTRICT ON UPDATE CASCADE;
