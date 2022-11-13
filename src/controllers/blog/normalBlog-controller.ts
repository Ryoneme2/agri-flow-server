import type { Response } from 'express';
import type { IGetUserAuthInfoRequest, UserJwtPayload } from '../../@types/jwt'
import axios, { AxiosError } from 'axios'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config()

import { httpStatus } from '@config/http';
import defaultValue from '@config/defaultValue';
import { validateSchema } from '@helper/validateSchema';
import * as schema from '@model/ajvSchema'
import * as blogService from '@service/blog/person/blog-service'
import { Prisma } from '@prisma/client'
import { decodePassword } from '@util/DecryptEncryptString';

const newBlog = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const data = req.body as {
      title: string,
      content: string
    }

    if (!req.jwtObject) return res.send({
      status: httpStatus.unauthorized,
      data: null,
      message: 'Access denied unauthorized.'
    })

    const userObjJWT = req.jwtObject as UserJwtPayload;

    const { success, msg } = validateSchema(schema.newPostSchema, data)

    if (!success) return res.status(httpStatus.badRequest).send({ msg })

    const response = await blogService._add({ author: userObjJWT.username, title: data.title, content: data.content })

    if (!response.success) return res.status(httpStatus.badRequest).send(response)

    res.sendStatus(httpStatus.created)

  } catch (error) {
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const getOneBlog = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const { blogId } = req.params

    if (isNaN(+blogId)) return res.status(httpStatus.badRequest).send({
      msg: 'blog id is invalid'
    })
    if (!blogId) return res.status(httpStatus.badRequest).send({
      msg: 'blog id is require'
    })

    if (!req.jwtObject) return res.send({
      status: httpStatus.unauthorized,
      data: null,
      message: 'Access denied unauthorized.'
    })

    const userObjJWT = req.jwtObject as UserJwtPayload;

    const blog = await blogService._getOne(+blogId)

    if (!blog.success) return res.status(httpStatus.conflict).send(blog)

    res.send(blog)

  } catch (e) {
    console.error(e);
    res.sendStatus(httpStatus.internalServerError)
  }
}

export {
  newBlog,
  getOneBlog
}
