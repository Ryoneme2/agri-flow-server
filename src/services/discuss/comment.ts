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

export const _add = async ({ author, postId, content }: { author: string, postId: number, content: string }) => {
  try {

    await prisma.discussComment.create({
      data: {
        context: content,
        usersUsername: author,
        discussPostDcpId: postId
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
      msg: 'internal error on add comment service'
    }


  }
}

export const _getByPost = async ({ postId, optional }: { postId: number, optional: { limit: number | undefined } }) => {
  try {

    const comments = await prisma.discussComment.findMany({
      take: optional.limit,
      where: {
        discussPostDcpId: postId
      }
    })

    return {
      data: comments,
      success: true,
      msg: ''
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: null,
      msg: 'internal error on get by post service'
    }


  }
}