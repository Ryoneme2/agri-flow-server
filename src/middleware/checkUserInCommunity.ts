import { Response, NextFunction } from 'express';
import { httpStatus } from '@config/http';
import type { UserJwtPayload, IGetUserAuthInfoRequest } from '@type/jwt'
import * as P from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new P.PrismaClient();

export const checkUserInCommunity = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  try {

    const { communityId } = req.params

    if (!communityId) return res.status(httpStatus.badRequest).send({ msg: 'community id is required' })

    const userObjJWT = req.jwtObject as UserJwtPayload;

    const user = await prisma.userInCommunity.findUnique({
      where: {
        username_commuId: {
          username: userObjJWT.username,
          commuId: communityId
        }
      }
    })

    if (user === null) return res.status(httpStatus.forbidden).send({
      msg: 'you are not in this community'
    })

    return next()
  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}