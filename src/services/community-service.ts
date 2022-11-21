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
  file: Express.Multer.File | undefined,
}) => {
  try {

    const uniqueString = v4();

    const fileRes = data.file ? await uploadToBucket.community(uniqueString, data.file.buffer, data?.file.mimetype) : {
      path: undefined
    }

    await prisma.community.create({
      data: {
        name: data.name,
        communityImage: fileRes.path,
        create_by: data.author
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
      msg: 'internal error on new group service'
    }
  }
}
