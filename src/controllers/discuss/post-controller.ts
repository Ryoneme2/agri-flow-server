import { _getListRecent } from './../../services/discuss/post';
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
import moment from 'moment';

export const newPost = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const { body, file } = req as {
      body: {
        content: string,
        categories?: number[],
      },
      file: Express.Multer.File
    }

    const userObjJWT = req.jwtObject as UserJwtPayload;

    const { success, msg } = validateSchema(schema.newPostDiscussSchema, body)

    if (!success) return res.status(httpStatus.badRequest).send({ msg })

    const response = await _add({ author: userObjJWT.username, content: body.content, categories: body.categories, file })

    if (!response.success) return res.sendStatus(httpStatus.internalServerError)

    res.sendStatus(httpStatus.created)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export const getRecentPost = async (req: Request, res: Response) => {
  try {

    const { limit, skip } = req.query

    const posts = await _getListRecent({ limit: +(limit?.toString() || '5'), skip: +(skip?.toString() || '0') })

    if (!posts.success) return res.sendStatus(httpStatus.internalServerError).send({
      msg: posts.msg
    })

    const format = posts.data?.map(post => {
      return {
        id: post.dcpId,
        post: {
          content: post.content,
          file: post.File
        },
        author: {
          username: post.create_by.username,
          isVerify: post.create_by.isVerify,
          imageProfile: post.create_by.imageProfile
        },
        create_at: moment(post.create_at).fromNow(),
        comments: post.DiscussComment.map(comment => {
          return {
            id: comment.id,
            content: comment.context,
            commenter: {
              username: comment.create_by.username,
              isVerify: comment.create_by.isVerify,
              imageProfile: comment.create_by.imageProfile
            },
            create_at: moment(comment.discuss_at.create_at).fromNow()
          }
        })
      }
    })

    res.send({
      data: format,
      msg: ''
    })

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

export const getFollowPost = async (req: IGetUserAuthInfoRequest, res: Response) => {
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

    const { postId } = req.params

    res.sendStatus(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}