import moment from 'moment';
import * as P from '@prisma/client';
import dotenv from 'dotenv';
import { v4 } from 'uuid';

import uploadToBucket from '@helper/uploadToBucket';
import storageClient from '@config/connectBucket';
import defaultValue from '@config/defaultValue';
import { stringToArrayBuffer } from '@util/base64ToBuffer';

dotenv.config();

const prisma = new P.PrismaClient();

export const _add = async (data: {
  author: string,
  content: string,
  file: Express.Multer.File,
}) => {
  try {
    const uniqueString = v4();

    await uploadToBucket.discuss(uniqueString, data.file.buffer, data.file.mimetype)

    const result = await prisma.discussPost.create({
      data: {
        usersUsername: data.author,

      },
    });
    return {
      isOk: true,
      data: result,
      msg: 'create success',
    };
  } catch (e) {
    console.log(e);

    return {
      isOk: false,
      msg: 'internal error on add post service',
    };
  } finally {
    prisma.$disconnect();
  }
};