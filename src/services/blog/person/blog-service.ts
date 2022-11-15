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

export const _add = async ({ author, title, content }: { author: string, title: string, content: string }) => {
  try {

    const splitContent = content.split('src="')
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

    await prisma.blogs.create({
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