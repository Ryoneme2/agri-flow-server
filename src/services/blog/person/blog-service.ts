import moment from 'moment';
import * as P from '@prisma/client';
import dotenv from 'dotenv';
import { v4 } from 'uuid';

import uploadToBucket from '@helper/uploadToBucket';
import { stringToArrayBuffer } from '@util/base64ToBuffer';

dotenv.config();

const prisma = new P.PrismaClient();

export const _add = async ({ author, title, content, categories }: { author: string, title: string, content: string, categories?: string[] }) => {
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


    const blogs = await prisma.blogs.create({
      data: {
        create_by: {
          connect: {
            username: author
          }
        },
        content: context,
        title
      }
    })

    await prisma.categoryOnBlogs.createMany({
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
    const blog = await prisma.blogs.findUnique({
      where: {
        blogId: id
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
        }
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

export const _getListSuggest = async ({ categoryId, limit = 3 }: { categoryId: number[], skip?: number, limit?: number }) => {
  try {
    const shuffle = (array) => {
      return [...array].sort(() => Math.random() - 0.5);
    }
    const categoryCount = [...new Set((await prisma.categoryOnBlogs.findMany({})).map(v => v.categoryId))]

    console.log(shuffle(categoryCount));

    const category = categoryId.length === 0 ? shuffle(categoryCount) : shuffle(categoryId)

    const blogCount = await prisma.blogs.count({
      where: {
        category: {
          every: {
            categoryId: {
              in: category
            }
          }
        }
      }
    })

    console.log({ blogCount });


    const ableSkip = blogCount - limit < 0 ? 0 : blogCount - limit

    const skip = Math.floor(Math.random() * ableSkip)

    const blogs = await prisma.blogs.findMany({
      skip,
      take: limit,
      where: {
        category: {
          every: {
            categoryId: {
              in: category
            }
          }
        }
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

export const _getListByCategory = async ({ tagId, limit = 3, skip = 0 }: {
  tagId: number,
  limit?: number,
  skip?: number
}) => {
  try {

    const [blogs, count] = await prisma.$transaction([
      prisma.blogs.findMany({
        skip,
        take: limit,
        where: {
          category: {
            every: {
              categoryId: tagId
            }
          }
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
      prisma.blogs.count({
        where: {
          category: {
            every: {
              categoryId: tagId
            }
          }
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

export const _getListByFollowing = async ({ author }: { author: string }) => {
  try {

    const followingList = (await prisma.follows.findMany({
      where: {
        following: {
          username: author
        }
      }
    })).map(v => v.followerUser)

    console.log({ followingList });

    const [blogs, count] = await prisma.$transaction([
      prisma.blogs.findMany({
        where: {
          create_by: {
            username: {
              in: followingList
            }
          },
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
      prisma.blogs.count({
        where: {
          create_by: {
            username: {
              in: followingList
            }
          },
        },
        orderBy: {
          create_at: 'desc'
        }
      })
    ])

    return {
      success: true,
      data: {
        blogs, count
      },
      msg: ''
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      msg: 'internal error on get list by following'
    }


  }
}

export const _getHistoryList = async ({ author, limit = 3, skip = 0 }: { author: string, limit: number, skip: number }) => {
  try {

    const views = (await prisma.userReadBlogPerson.findMany({
      where: {
        usersUsername: author
      },
      select: {
        BlogId: true
      }
    })).map(v => v.BlogId)

    const [blogCount, blogs] = await prisma.$transaction([prisma.blogs.count({
      where: {
        blogId: {
          in: views
        }
      },
    }), prisma.blogs.findMany({
      skip,
      take: limit,
      where: {
        blogId: {
          in: views
        }
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

export const _getUserBlogList = async ({ username }: { username: string }) => {
  try {

    const [blogs, blogCount] = await prisma.$transaction([
      prisma.blogs.findMany({
        where: {
          usersUsername: username
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
      }),
      prisma.blogs.count({
        where: {
          usersUsername: username
        },
      })
    ])

    return {
      data: {
        blogs,
        blogCount
      },
      msg: ''
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      msg: 'internal error on get blog of each user service'
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