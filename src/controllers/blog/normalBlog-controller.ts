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
import { _getOne, _getOneAll } from '@service/user-service';
import getThumbnail from '@util/getThumbnail';

const newBlog = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const data = req.body as {
      title: string,
      content: string
    }

    if (!req.jwtObject) return res.send({
      msg: 'Access denied unauthorized.'
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

    const blog = await blogService._getOne(+blogId)

    if (!blog.success) return res.status(httpStatus.internalServerError).send(blog)

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

    return res.send({ data: format })

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const getSuggestListBlog = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    if (!req.jwtObject) return res.send({
      msg: 'Access denied unauthorized.'
    })

    const userObjJWT = req.jwtObject as UserJwtPayload;

    const user = await _getOneAll({ username: userObjJWT.username })

    if (!user.data) return res.sendStatus(httpStatus.unauthorized)

    const categoryUser = user.data.readBlog.map(rb => rb.Blog.category.map(b => b.categoryId)).flat().flat()
    const blogs = await blogService._getList({ categoryId: categoryUser })

    if (!blogs.data) return res.send({ msg: 'no blog found' })

    const formatBlog = blogs.data.map(b => {
      return {
        id: b.blogId,
        blogContent: {
          title: b.title,
          // content: b.content
        },
        thumbnail: getThumbnail(b.content)
      }
    })

    console.log(formatBlog, {
      user
    });

    res.send({
      formatBlog,
      categoryUser
    })

  } catch (e) {
    console.error(e);
    res.sendStatus(httpStatus.internalServerError)
  }
}

export {
  newBlog,
  getOneBlog,
  getSuggestListBlog
}
