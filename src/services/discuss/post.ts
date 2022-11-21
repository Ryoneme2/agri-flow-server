import moment from 'moment';
import * as P from '@prisma/client';
import dotenv from 'dotenv';
import { v4 } from 'uuid';

import uploadToBucket from '@helper/uploadToBucket';
import defaultValue from '@config/defaultValue';
import { stringToArrayBuffer } from '@util/base64ToBuffer';
import sharp from 'sharp'

dotenv.config();

const prisma = new P.PrismaClient();

export const _add = async (data: {
  author: string,
  content: string,
  categories?: number[] | null,
  file: Express.Multer.File | undefined,
}) => {
  try {
    const uniqueString = v4();

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

    if (data.categories) {
      await prisma.categoryOnDiscuss.createMany({
        data: data.categories.map(c => {
          return { categoryId: c, postId: result.dcpId }
        })
      })
    }

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
            create_by: {
              select: {
                username: true,
                imageProfile: true,
                isVerify: true
              }
            },
            discuss_at: true,
          }
        },
        category: true
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

export const _getOne = async (id: number) => {
  try {

    const post = await prisma.discussPost.findUnique({
      where: {
        dcpId: id
      },
      include: {
        likeBy: {
          select: {
            Users: {
              select: {
                username: true,
                isVerify: true,
                imageProfile: true,
              }
            }
          }
        },
        create_by: {
          select: {
            username: true,
            isVerify: true,
            imageProfile: true,
          }
        },
        category: true,
        DiscussComment: {
          include: {
            create_by: {
              select: {
                username: true,
                isVerify: true,
                imageProfile: true,
              }
            }
          }
        }
      }
    })

    return {
      success: true,
      data: post,
      msg: '',
    }



  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: null,
      msg: 'internal error on get one post service'
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
