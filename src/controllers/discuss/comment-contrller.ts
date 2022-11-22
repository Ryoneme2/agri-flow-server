import type { Request, Response } from 'express';
import axios, { AxiosError } from 'axios'
import type { IGetUserAuthInfoRequest, UserJwtPayload } from '@type/jwt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config()

import { httpStatus } from '@config/http';
import { validateSchema } from '@helper/validateSchema';
import * as schema from '@model/ajvSchema'
import * as userService from '@service/user-service'
import { client } from '@config/redisConnect'
import { _add } from '@service/discuss/comment';


export const newComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const bodyData = req.body

    const userObjJWT = req.jwtObject as UserJwtPayload;

    const { success, msg } = validateSchema(schema.newCommentDiscussSchema, bodyData)

    if (!success) return res.status(httpStatus.badRequest).send({ msg })

    const response = await _add({ author: userObjJWT.username, postId: bodyData.postId, content: bodyData.content })

    if (!response.success) return res.sendStatus(httpStatus.internalServerError)

    res.sendStatus(httpStatus.created)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export const getCommentByPost = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    res.sendStatus(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export const editComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    res.sendStatus(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export const deleteComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    res.sendStatus(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}