import moment from 'moment';
import * as P from '@prisma/client';
import dotenv from 'dotenv';
import { v4 } from 'uuid';

import uploadToBucket from '@helper/uploadToBucket';
import { stringToArrayBuffer } from '@util/base64ToBuffer';

dotenv.config();

const prisma = new P.PrismaClient();

export const _join = async ({ author, communityId }: { author: string, communityId: string }) => {
  try {

    await prisma.userInCommunity.create({
      data: {
        username: author,
        commuId: communityId
      }
    })

    return {
      success: true,
      msg: ''
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      msg: 'internal error on join community service'
    }


  }
}

export const _add = async ({ author, title, content, categories }: { author: { commuId: string, username: string }, title: string, content: string, categories?: string[] }) => {
  try {

    const categoriesId = (await prisma.category.findMany({
      where: {
        categoryName: {
          in: categories
        }
      },
      select: {
        categoryId: true
      }
    })).map(v => v.categoryId)

    const splitContentLastWord = content.split('"')

    console.log(splitContentLastWord);
    const res = await Promise.all(splitContentLastWord.map(async (v, i) => {
      if (v.startsWith('data:image')) {
        return {
          data: await uploadToBucket.blog(v4(), stringToArrayBuffer(v)),
          index: i
        }
      }
    }).filter(v => v !== undefined));

    if (!res.every(v => !v?.data.error)) return {
      success: false,
      msg: 'error on upload image to bucket'
    }

    const context = splitContentLastWord.map((v, i) => {
      const links = res.find(link => (link?.index || -1) === i)
      if (!links) return `${v}"`
      return `${links.data.path}"`
    }).join('')


    const blogs = await prisma.blogsOnCommunity.create({
      data: {
        communityCommuId: author.commuId,
        usersUsername: author.username,
        content: context,
        title
      }
    })

    await prisma.categoryOnBlogsCommunity.createMany({
      data: categoriesId.map(c => {
        return { categoryId: c, blogUserId: blogs.blogId }
      })
    })

    return {
      success: true,
      msg: 'success'
    }

  } catch (error) {
    console.error(error);

    return {
      success: false,
      msg: 'internal error on add blog service'
    }
  } finally {
    await prisma.$disconnect()
  }
}

export const _getOne = async (id: number) => {
  try {
    const blog = await prisma.blogsOnCommunity.findUnique({
      where: {
        blogId: id,
      },
      include: {
        create_by: {
          include: {
            Blogs: {
              select: {
                blogId: true
              }
            }
          }
        },
        category: true,
        BlogComment: {
          include: {
            comment_by: true
          }
        },
        at_community: true
      }
    })

    return {
      success: true,
      data: blog,
      msg: 'success'
    }

  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      msg: 'internal error on get one blog person'
    }
  } finally {
    await prisma.$disconnect()
  }
}

export const _getListSuggest = async ({ categoryId, limit = 3, communityId }: { communityId: string, categoryId: number[], skip?: number, limit?: number }) => {
  try {
    const shuffle = (array) => {
      return [...array].sort(() => Math.random() - 0.5);
    }

    const category = categoryId.length === 0 ? [...new Set(new Array(3).fill(0).map(_ => Math.ceil(Math.random() * 9)))] : shuffle(categoryId)

    console.log({ x: [...new Set(category)] });

    const blogCount = await prisma.blogsOnCommunity.count({
      where: {
        category: {
          every: {
            categoryId: {
              in: [...new Set(category)]
            }
          }
        },
        communityCommuId: communityId
      }
    })

    const ableSkip = blogCount - limit < 0 ? 0 : blogCount - limit

    const skip = Math.floor(Math.random() * ableSkip)

    const blogs = await prisma.blogsOnCommunity.findMany({
      skip,
      take: limit,
      where: {
        category: {
          every: {
            categoryId: {
              in: [...new Set(category)]
            }
          }
        },
        communityCommuId: communityId
      },
      include: {
        create_by: {
          select: {
            username: true,
            imageProfile: true,
            isVerify: true
          }
        },
        category: true
      }
    })

    return {
      success: true,
      data: {
        blogCount,
        blogs
      },
      msg: 'success'
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: null,
      msg: 'internal error on get person blog list'
    }
  } finally {
    prisma.$disconnect()
  }
}

export const _getListByCategory = async ({ tagId, limit = 3, skip = 0, communityId }: {
  tagId: number,
  limit?: number,
  skip?: number,
  communityId: string
}) => {
  try {

    const [blogs, count] = await prisma.$transaction([
      prisma.blogsOnCommunity.findMany({
        skip,
        take: limit,
        where: {
          category: {
            every: {
              categoryId: tagId
            }
          },
          communityCommuId: communityId
        },
        include: {
          create_by: {
            select: {
              username: true,
              imageProfile: true,
              isVerify: true
            }
          },
          category: true
        },
        orderBy: {
          create_at: 'desc'
        }
      }),
      prisma.blogsOnCommunity.count({
        where: {
          category: {
            every: {
              categoryId: tagId
            }
          },
          communityCommuId: communityId
        },
        orderBy: {
          create_at: 'desc'
        }
      })
    ])

    return {
      data: {
        blogs,
        count
      },
      success: true,
      msg: 'success'
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      msg: 'internal error on get list by category service'
    }

  }
}

export const _getHistoryList = async ({ communityId, author, limit = 3, skip = 0 }: { communityId: string, author: string, limit: number, skip: number }) => {
  try {

    const views = (await prisma.userReadBlogPerson.findMany({
      where: {
        usersUsername: author
      },
      select: {
        BlogId: true
      }
    })).map(v => v.BlogId)

    const [blogCount, blogs] = await prisma.$transaction([prisma.blogsOnCommunity.count({
      where: {
        blogId: {
          in: views
        },
        communityCommuId: communityId
      },
    }), prisma.blogsOnCommunity.findMany({
      skip,
      take: limit,
      where: {
        blogId: {
          in: views
        },
        communityCommuId: communityId
      },
      include: {
        create_by: {
          select: {
            username: true,
            imageProfile: true,
            isVerify: true
          }
        },
        category: true
      },
    })])


    return {
      success: true,
      data: blogs,
      count: blogCount,
      msg: ''
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: null,
      msg: 'internal error on get history blog service'
    }
  }
}

export const _updateView = async ({ username, blogId }: { username: string, blogId: number }) => {
  try {

    await prisma.userReadBlogPerson.create({
      data: {
        usersUsername: username,
        BlogId: blogId
      }
    })

    return {
      success: false,
      msg: 'success'
    }

  } catch (e) {
    if (e instanceof P.Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        return {
          isOk: false,
          data: {},
          msg: `id is duplicate`,
        };
      }
      return {
        isOk: false,
        data: {},
        msg: 'Internal Server Error register service',
      };
    }
    console.error(e);
    return {
      success: false,
      msg: 'internal error on update user view blog service'
    }
  }
}