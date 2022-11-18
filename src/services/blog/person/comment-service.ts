import moment from 'moment';
import * as P from '@prisma/client';
import dotenv from 'dotenv';

import defaultValue from '@config/defaultValue';

dotenv.config();

const prisma = new P.PrismaClient();

const _add = async ({ content, blogId, author }: { content: string, blogId: number, author: string }) => {
  try {

    await prisma.blogComment.create({
      data: {
        usersUsername: author,
        context: content,
        blogsBlogId: blogId
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
      msg: 'fail to create comment service'
    }
  }
}

const _getCommentByBlogId = async ({ blogId, optional = {} }: {
  blogId: number,
  optional?: {
    limit?: number,
    skip?: number,
    order?: 'desc' | 'asc'
  }
}) => {
  try {

    const res = await prisma.blogComment.findMany({
      take: optional.limit,
      skip: optional.skip,
      where: {
        blogsBlogId: blogId,
      },
      include: {
        comment_by: {
          select: {
            username: true,
            imageProfile: true,
            isVerify: true,
          }
        }
      },
      orderBy: {
        create_at: optional.order && 'desc'
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
      data: null,
      msg: 'internal error when try to get comment by id (service)'
    }
  }
}

export {
  _add,
  _getCommentByBlogId
}