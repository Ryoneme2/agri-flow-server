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

export const _add = async ({ author, title, content }: { author: string, title: string, content: string }) => {
  try {

    await prisma.blogs.create({
      data: {
        create_by: {
          connect: {
            username: author
          }
        },
        content,
        title
      }
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
  }
}

export const _getOne = async (id: number) => {
  try {
    const blog = await prisma.blogs.findUnique({
      where: {
        blogId: id
      },
      include: {
        create_by: true,
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
  }
}