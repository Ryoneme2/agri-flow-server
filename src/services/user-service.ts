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

export const _add = async ({ username, password, email, imageProfile = defaultValue.blankImage }: {
  username: string,
  password: string | null,
  email: string,
  imageProfile?: string
}) => {
  try {
    const hashedPass = !password ? null : await hashString(password) || null

    await prisma.users.create({
      data: {
        username,
        password: hashedPass?.hash || null,
        email,
        imageProfile
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

export const _getOne = async <T>({ rawConfig }: { rawConfig: P.Prisma.UsersFindUniqueArgs }): Promise<{
  success: boolean,
  data: T | null,
  msg: string
}> => {
  try {

    const user = await prisma.users.findUnique(rawConfig) as T

    return {
      success: true,
      data: user,
      msg: 'success'
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: null,
      msg: 'internal error'
    }
  }
}