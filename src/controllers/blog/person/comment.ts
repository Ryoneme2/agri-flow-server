import type { Response, Request } from 'express';
import type { IGetUserAuthInfoRequest, UserJwtPayload } from '@type/jwt'
import axios, { AxiosError } from 'axios'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config()

import { httpStatus } from '@config/http';
import defaultValue from '@config/defaultValue';
import { validateSchema } from '@helper/validateSchema';
import * as schema from '@model/ajvSchema'
import * as blogService from '@service/blog/person/blog-service'
import moment from 'moment';
import { client } from '@config/redisConnect';
import { _getOne, _getOneAll } from '@service/user-service';
import { _getAll, _getById } from '@service/category-service';
import { _add, _getCommentByBlogId } from '@service/blog/person/comment-service';

export const newComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const data = req.body as {
      content: string
      blogId: number,
    }

    if (!req.jwtObject) return res.send({
      msg: 'Access denied unauthorized.'
    })

    const userObjJWT = req.jwtObject as UserJwtPayload;

    const { success, msg } = validateSchema(schema.newCommentSchema, data)

    if (!success) return res.status(httpStatus.badRequest).send({ msg })

    const response = await _add({ content: data.content, blogId: data.blogId, author: userObjJWT.username })

    if (!response.success) return res.status(httpStatus.internalServerError).send({ msg: response.msg })

    res.sendStatus(httpStatus.created)

  } catch (error) {
    console.error(error)
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export const getBlogComment = async (req: Request, res: Response) => {
  try {

    const { blogId } = req.params
    const { limit, skip } = req.query

    const comments = await _getCommentByBlogId({
      blogId: +blogId, optional: {
        limit: !limit ? undefined : +limit.toString(),
        skip: !skip ? undefined : +skip.toString()
      }
    })

    if (!comments.success) return res.status(httpStatus.internalServerError).send({ msg: comments.msg })

    const format = comments.data?.map(cmt => {
      return {
        id: cmt.id,
        author: {
          username: cmt.comment_by.username
        },
        comment: {
          content: cmt.context
        },
        create_at: moment(cmt.create_at).fromNow()
      }
    })

    res.send({
      data: format || [],
      msg: ''
    })

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}