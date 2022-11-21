import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { v4 } from 'uuid';

dotenv.config();

const prisma = new PrismaClient();

export const _update = async ({ postsId, num, username }) => {
  try {
    num == 1
      ? await prisma.likeBy.create({
        data: {
          postsId,
          username,
        },
      })
      : await prisma.likeBy.delete({
        where: {
          username_postsId: {
            username: username,
            postsId: postsId,
          },
        },
      });

    return {
      isOk: true,
      msg: 'updated',
    };
  } catch (e) {
    console.log(e);
    return {
      isOk: false,
      msg: 'internal error on update like service',
    };
  } finally {
    prisma.$disconnect();
  }
};