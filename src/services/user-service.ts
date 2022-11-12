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

export const _add = async ({ username, password, email }) => {
  try {
    const hashedPass = await hashString(password)
    if (!hashedPass) throw new Error()

    await prisma.users.create({
      data: {
        username,
        password: hashedPass.hash,
        email,
        imageProfile: defaultValue.blankImage
      }
    })

    return {
      success: true,
      msg: 'created'
    }
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