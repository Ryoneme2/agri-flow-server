import { Response } from 'express';
import axios, { AxiosError } from 'axios'
import type { IGetUserAuthInfoRequest, UserJwtPayload } from '@type/jwt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config()

import { httpStatus } from '@config/http';
import { validateSchema } from '@helper/validateSchema';
import * as schema from '@model/ajvSchema'
import * as discussService from '@service/discuss'
import { client } from '@config/redisConnect'

const updateLike = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { num } = req.body;
    const { postId } = req.params;

    if (!postId || !num) return res.sendStatus(httpStatus.badRequest)

    const userObjJWT = req.jwtObject as UserJwtPayload;

    const result = await discussService.like._update({
      postsId: +postId,
      num: +(num.toString()),
      username: userObjJWT.username,
    });

    if (!result.isOk)
      return res.status(httpStatus.internalServerError).send({
        msg: result.msg,
      });

    return res.sendStatus(httpStatus.created)
  } catch (e) {
    console.log(e);

    return res.sendStatus(httpStatus.internalServerError)
  }
};

export {
  updateLike
}