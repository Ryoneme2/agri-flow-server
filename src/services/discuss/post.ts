import moment from 'moment';
import * as P from '@prisma/client';
import dotenv from 'dotenv';
import { v4 } from 'uuid';

import uploadToBucket from '@helper/uploadToBucket';
import storageClient from '@config/connectBucket';
import defaultValue from '@config/defaultValue';
import { stringToArrayBuffer } from '@util/base64ToBuffer';
import sharp from 'sharp'

dotenv.config();

const prisma = new P.PrismaClient();

export const _add = async (data: {
  author: string,
  content: string,
  file: Express.Multer.File | undefined,
}) => {
  try {
    const uniqueString = v4();

    /* A function that takes the image and resize it to 750px and then it will composite the image with
    the background color of the image. */
    // const semiTransparentRedPng = await sharp()
    //   .resize(750)
    //   .composite([{
    //     input: data.file?.buffer,
    //     blend: 'dest-in'
    //   }])
    //   .png().toBuffer()

    const fileRes = data.file ? await uploadToBucket.discuss(uniqueString, data.file.buffer, data?.file.mimetype) : {
      path: null
    }

    const result = await prisma.discussPost.create({
      data: {
        usersUsername: data.author,
        content: data.content,
        File: fileRes.path
      },
    });

    return {
      success: true,
      data: result,
      msg: 'create success',
    };
  } catch (e) {
    console.log(e);

    return {
      success: false,
      msg: 'internal error on add post service',
    };
  } finally {
    prisma.$disconnect();
  }
};

export const _getListRecent = async ({
  limit = 5,
  skip = 0,
}) => {
  try {

    const posts = await prisma.discussPost.findMany({
      take: limit,
      skip,
      include: {
        create_by: {
          select: {
            username: true,
            isVerify: true,
            imageProfile: true
          }
        },
        DiscussComment: {
          include: {
            dicuss_by: {
              select: {
                username: true,
                imageProfile: true,
                isVerify: true
              }
            },
            discuss_at: true,
          }
        }
      },
      orderBy: {
        create_at: 'desc'
      }
    })

    return {
      success: true,
      data: posts,
      msg: ''
    }

  } catch (e) {
    return {
      success: false,
      msg: 'internal error on get list recent'
    }
  }
}

export const _deletePost = async (postId: number) => {
  try {

    await prisma.$transaction([
      prisma.discussComment.deleteMany({
        where: {
          discussPostDcpId: postId
        }
      }),
      prisma.discussPost.delete({
        where: {
          dcpId: postId
        }
      })
    ])

    return {
      success: true,
      msg: ''
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      msg: 'internal error on delete post service'
    }
  }
}
