import moment from 'moment';
import * as P from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '@config/connectBucket';
import { v4 } from 'uuid';

import { hashString, decodePassword } from '@util/DecryptEncryptString';
// import uploadToBucket from '@helper/uploadToBucket';

dotenv.config();

const prisma = new P.PrismaClient();

const _add = async ({ username, password, email }) => {
  try {
    // await prisma.users.create({
    //   data: {
    //     username
    //   }
    // })
  } catch (error) {
    console.error(error)
    return {
      success: false,
      msg: 'internal error add user to database'
    }
  } finally {
    prisma.$disconnect()
  }
}