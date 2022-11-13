import moment from 'moment';
import * as P from '@prisma/client';
import dotenv from 'dotenv';
import { v4 } from 'uuid';

import { hashString, decodePassword } from '@util/DecryptEncryptString';
import uploadToBucket from '@helper/uploadToBucket';
import storageClient from '@config/connectBucket';
import defaultValue from '@config/defaultValue';
import { Request, Response } from 'express';

dotenv.config();

const prisma = new P.PrismaClient();

export const test = async (req: Request, res: Response) => {
  const data = await prisma.users.findMany()

  res.send({ data })
}