import moment from 'moment';
import * as P from '@prisma/client';
import dotenv from 'dotenv';
import { v4 } from 'uuid';

import { hashString, decodePassword } from '@util/DecryptEncryptString';
import uploadToBucket from '@helper/uploadToBucket';
import storageClient from '@config/connectBucket';
import defaultValue from '@config/defaultValue';

dotenv.config();

const prisma = new P.PrismaClient();

export const _addLine = async ({ username, email, imageProfile = defaultValue.blankImage }: {
  username: string,
  email: string,
  imageProfile?: string
}) => {
  try {

    await prisma.users.create({
      data: {
        username,
        email,
        imageProfile
      }
    })

    return {
      success: true,
      msg: 'created'
    }
  } catch (error) {
    console.log(error);
    if (error instanceof P.Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        return {
          success: false,
          data: {},
          msg: `username is already taken`,
        };
      }
      return {
        success: false,
        data: {},
        msg: 'Internal Server Error register service',
      };
    }

    return {
      success: false,
      data: {},
      msg: 'Internal Server Error register service',
    };
  } finally {
    await prisma.$disconnect()
  }
}

export const _add = async ({ username, password, email, imageProfile = defaultValue.blankImage }: {
  username: string,
  password: string | null,
  email: string | null,
  imageProfile?: string
}) => {
  try {
    const hashedPass = !password ? null : await hashString(password) || null

    await prisma.users.create({
      data: {
        username,
        password: hashedPass?.hash || null,
        email,
        imageProfile
      }
    })

    return {
      success: true,
      msg: 'created'
    }
  } catch (error) {
    console.log(error);
    if (error instanceof P.Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        return {
          success: false,
          data: {},
          msg: `username is already taken`,
        };
      }
      return {
        success: false,
        data: {},
        msg: 'Internal Server Error register service',
      };
    }

    return {
      success: false,
      data: {},
      msg: 'Internal Server Error register service',
    };
  } finally {
    await prisma.$disconnect()
  }
}

export const _getOne = async ({ username }: { username: string }) => {
  try {

    const user = await prisma.users.findUnique({
      where: {
        username,
      },
      include: {
        followedBy: {
          include: {
            following: {
              select: {
                username: true,
                imageProfile: true
              }
            }
          }
        },
      }
    })

    return {
      success: true,
      data: user,
      msg: 'success'
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: null,
      msg: 'internal error'
    }
  } finally {
    await prisma.$disconnect()
  }
}

export const _getOneMail = async ({ mail }: { mail: string }) => {
  try {

    const user = await prisma.users.findUnique({
      where: {
        email: mail,
      }
    })

    return {
      success: true,
      data: user,
      msg: 'success'
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: null,
      msg: 'internal error'
    }
  } finally {
    await prisma.$disconnect()
  }
}

export const _getOneAll = async ({ username }: { username: string }) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        username,
      },
      include: {
        readBlog: {
          include: {
            Blog: {
              include: {
                _count: true,
                category: true
              }
            }
          }
        },
        Blogs: {
          include: {
            _count: true,
            category: true
          }
        },
        BlogsOnCommunity: {
          include: {
            _count: true
          }
        }
      }
    })

    return {
      success: true,
      data: user,
      msg: 'success'
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: null,
      msg: 'internal error'
    }
  } finally {
    await prisma.$disconnect()
  }
}

export const _updatePassByEmail = async ({ email, pass }: { email: string, pass: string }) => {
  try {

    const hashedPassword = await hashString(pass)

    if (!hashedPassword) return {
      success: false,
      msg: 'can not hash password'
    }

    await prisma.users.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword.hash
      }
    })

    return {
      success: true,
      msg: 'success'
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      msg: 'can not hash password'
    }

  }
}

export const _addFollow = async ({ who, author }: { who: string, author: string }) => {
  try {

    await prisma.follows.create({
      data: {
        followingUser: author,
        followerUser: who
      }
    })

    return {
      success: true,
      msg: ''
    }

  } catch (e) {
    console.error(e);
    if (e instanceof P.Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2003') {
        return {
          success: false,
          data: {},
          msg: `user are not found`,
        };
      }
      return {
        success: false,
        data: {},
        msg: 'Internal Server Error register service',
      };
    }
    return {
      success: false,
      msg: 'internal error add follower'
    }
  }
}

export const _getAllFollowing = async ({ author }: { author: string | null }) => {
  try {

    if (author === null) return {
      success: true,
      data: [],
      msg: ''
    }

    const follows = (await prisma.follows.findMany({
      where: {
        followingUser: author
      }
    })).map(v => v.followerUser)

    return {
      success: true,
      data: follows,
      msg: ''
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: [],
      msg: 'internal error on get following service'
    }

  }
}
