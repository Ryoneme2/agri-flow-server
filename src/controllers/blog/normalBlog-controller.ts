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
import { Prisma } from '@prisma/client'
import { decodePassword } from '@util/DecryptEncryptString';
import moment from 'moment';
import { client } from '@config/redisConnect';

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

const getOneBlog = async (req: Request, res: Response) => {
  try {

    const { blogId } = req.params

    if (isNaN(+blogId)) return res.status(httpStatus.badRequest).send({
      msg: 'blog id is invalid'
    })
    if (!blogId) return res.status(httpStatus.badRequest).send({
      msg: 'blog id is require'
    })

    const blog = await blogService._getOne(+blogId)

    if (!blog.success) return res.status(httpStatus.conflict).send(blog)

    if (!blog.data) return res.send({ msg: 'no blog found' })

    const format = {
      blogContent: {
        title: blog.data.title,
        content: blog.data.content
      },
      create_at: moment(blog.data.create_at).fromNow(),
      comments: blog.data.BlogComment.map(comment => {
        return {
          username: comment.comment_by.username,
          content: comment.context,
          create_at: moment(comment.create_at).fromNow()
        }
      }),
      author: {
        username: blog.data.create_by.username,
        imageProfile: blog.data.create_by.imageProfile,
        blogCount: blog.data.create_by.Blogs.length,
        followerCount: 0,
        socialMedia: {
          facebook: null,
          line: null,
          email: blog.data.create_by.email
        }
      }
    }

    // await connectClient()

    await client.setEx(`blogId-${blogId}`, 3600, JSON.stringify(format))

    res.send({ data: format })

  } catch (e) {
    console.error(e);
    res.sendStatus(httpStatus.internalServerError)
  } finally {
    // await quitClient()
  }
}

const getListBlog = (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const type = !req.query.type ? 'suggest' : req.query.type

  } catch (e) {
    console.error(e);


  }
}

export {
  newBlog,
  getOneBlog,
  getListBlog
}
