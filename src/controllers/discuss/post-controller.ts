import type { Request, Response } from 'express';
import type { IGetUserAuthInfoRequest, UserJwtPayload } from '@type/jwt';
import axios, { AxiosError } from 'axios'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config()

import { httpStatus } from '@config/http';
import defaultValue from '@config/defaultValue';
import { validateSchema } from '@helper/validateSchema';
import * as schema from '@model/ajvSchema'
import * as userService from '@service/user-service'
import { Prisma } from '@prisma/client'
import { decodePassword } from '@util/DecryptEncryptString';
import { client } from '@config/redisConnect'
import { _add } from '@service/discuss/post';

export const newPost = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const { body, file } = req

    const userObjJWT = req.jwtObject as UserJwtPayload;

    const { success, msg } = validateSchema(schema.newPostDiscussSchema, body)

    if (!success) return res.status(httpStatus.badRequest).send({ msg })

    const response = await _add({ author: userObjJWT.username, content: body.content, file })

    if (!response.success) return res.sendStatus(httpStatus.internalServerError)

    res.sendStatus(httpStatus.created)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export const getRecentPost = async (req: Request, res: Response) => {
  try {

    res.sendStatus(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export const getSuggestPost = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    res.sendStatus(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export const editPost = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    res.sendStatus(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export const deletePost = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    res.sendStatus(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}