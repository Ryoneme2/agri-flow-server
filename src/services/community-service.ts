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

export const _addGroup = async (data: {
  author: string,
  name: string,
  description: string,
  file: Express.Multer.File | undefined,
}) => {
  try {

    const uniqueString = v4();

    const fileRes = data.file ? await uploadToBucket.community(uniqueString, data.file.buffer, data?.file.mimetype) : {
      path: undefined
    }

    const res = await prisma.community.create({
      data: {
        name: data.name,
        communityImage: fileRes.path,
        create_by: data.author,
        description: data.description
      }
    })

    await prisma.userInCommunity.create({
      data: {
        username: data.author,
        commuId: res.commuId
      }
    })

    return {
      success: true,
      data: res,
      msg: ''
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      msg: 'internal error on new group service'
    }
  }
}

// blog , name , blogcount , member in the commu ,descp
export const _getOne = async ({ communityId }) => {
  try {

    const res = await prisma.community.findUnique({
      where: {
        commuId: communityId
      },
      include: {
        users: {
          include: {
            Users: {
              select: {
                username: true,
                imageProfile: true,
                isVerify: true
              }
            }
          }
        },
        BlogsOnCommunity: {
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
        }
      }
    })



    return {
      msg: '',
      data: res,
      success: true
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: null,
      msg: 'internal error on get one service'
    }
  }
}

export const _getList = async ({ limit, skip }: { limit: number, skip: number }) => {
  try {

    const communities = await prisma.community.findMany({
      take: limit,
      skip,
      include: {
        users: {
          select: {
            Users: {
              select: {
                username: true,
                imageProfile: true
              }
            }
          }
        }
      }
    })

    return {
      success: true,
      data: communities,
      msg: ''
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: null,
      msg: 'internal error on get list service'
    }

  }
}
