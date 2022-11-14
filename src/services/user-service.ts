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

export const _add = async ({ username, password, email, imageProfile = defaultValue.blankImage }: {
  username: string,
  password: string | null,
  email: string,
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
          isOk: false,
          data: {},
          msg: `username is already taken`,
        };
      }
      return {
        isOk: false,
        data: {},
        msg: 'Internal Server Error register service',
      };
    }

    return {
      isOk: false,
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
        Blogs: {
          include: {
            _count: true
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