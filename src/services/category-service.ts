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

export const _getAll = async () => {
  try {
    const cate = await prisma.category.findMany({})

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