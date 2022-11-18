import { httpStatus } from '@config/http';
import moment from 'moment';
import * as P from '@prisma/client';
import dotenv from 'dotenv';
import { v4 } from 'uuid';

import { hashString, decodePassword } from '@util/DecryptEncryptString';
import uploadToBucket from '@helper/uploadToBucket';
import storageClient from '@config/connectBucket';
import defaultValue from '@config/defaultValue';
import { stringToArrayBuffer } from '@util/base64ToBuffer';

dotenv.config();

const prisma = new P.PrismaClient();

export const _add = async (categoryName: string) => {
  try {

    await prisma.category.create({
      data: {
        categoryName
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
      msg: 'internal error on add category service'
    }


  }
}

export const _getById = async (cateId: number[]) => {
  try {

    const cate = await prisma.category.findMany({
      where: {
        categoryId: {
          in: cateId
        }
      },
      select: {
        categoryName: true
      }
    })

    return {
      success: true,
      data: cate.map(v => v.categoryName),
      msg: 'success'
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      msg: 'internal error on getById service (category)',
      data: null
    }
  }
}

export const _getAll = async (rawLimit?: number, char?: string) => {
  try {
    const cateCount = await prisma.category.count()

    const limit = !rawLimit ? cateCount : rawLimit

    const cate = await prisma.category.findMany({
      take: limit,
      where: {
        categoryName: {
          startsWith: char
        }
      }
    })

    return {
      success: true,
      data: cate,
      msg: 'success'
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      msg: 'internal error on getById service (category)',
      data: null
    }
  }
}