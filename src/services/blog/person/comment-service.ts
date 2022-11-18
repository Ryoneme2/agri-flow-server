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

export {
  _add
}