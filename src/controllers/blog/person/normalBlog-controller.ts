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
import getContent from '@util/getConent';
import { _getAll, _getById } from '@service/category-service';

const newBlog = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const data = req.body as {
      title: string,
      content: string
      categories: string[]
    }

    if (!req.jwtObject) return res.send({
      msg: 'Access denied unauthorized.'
    })

    const userObjJWT = req.jwtObject as UserJwtPayload;

    const { success, msg } = validateSchema(schema.newPostSchema, data)

    if (!success) return res.status(httpStatus.badRequest).send({ msg })

    const response = await blogService._add({ author: userObjJWT.username, title: data.title, content: data.content, categories: data.categories })

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
    const blogCategories = blog?.data?.category.map(c => c.categoryId) || []
    const categories = (await _getById(blogCategories)).data || []

    if (!blog.success) return res.status(httpStatus.internalServerError).send(blog)

    if (!blog.data) return res.send({ msg: 'no blog found' })

    const format = {
      blogContent: {
        title: blog.data.title,
        content: blog.data.content
      },
      categories,
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

    await client.setEx(`blogId-${blogId}`, 3600, JSON.stringify(format))

    return res.send({ data: format })

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const getSuggestListBlog = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const { skip, limit } = req.query

    // const xSkip = !skip ? 0 : +skip.toString()
    const xLimit = !limit ? 3 : +limit.toString()

    const userObjJWT = req.jwtObject as UserJwtPayload;

    const user = await _getOneAll({ username: userObjJWT?.username || '' })

    const categoryUser = !user.data ? [] : user.data.readBlog.map(rb => rb.Blog.category.map(b => b.categoryId)).flat().flat()
    const blogs = await blogService._getListSuggest({ categoryId: categoryUser, limit: xLimit })
    const allCategoryName = await _getAll()

    if (!blogs.data) return res.send({ msg: 'no blog found' })

    const formatBlog = blogs.data.map(b => {
      return {
        id: b.blogId,
        blogContent: {
          title: b.title,
          content: getContent(b.content)
        },
        create_at: moment(b.create_at).fromNow(),
        thumbnail: getThumbnail(b.content),
        author: {
          username: b.create_by.username
        },
        tag: allCategoryName.data?.find(v => v.categoryId === b.category[0].categoryId) || 'ไม่มีแท็คจร้า',
      }
    })

    res.send({
      data: formatBlog,
    })

  } catch (e) {
    console.error(e);
    res.sendStatus(httpStatus.internalServerError)
  }
}

const getListUserBlog = async (req: Request, res: Response) => {
  try {

    res.sendStatus(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const getListCategoryBlog = async (req: Request, res: Response) => {
  try {

    const { skip, limit } = req.query
    const { categoryId } = req.params

    const xLimit = !limit ? 3 : +limit.toString()
    const xSkip = !skip ? 3 : +skip.toString()

    const blogs = await blogService._getListByCategory({ tagId: +categoryId, limit: xLimit, skip: xSkip })

    const allCategoryName = await _getAll()

    if (!blogs.data) return res.send({ msg: 'no blog found' })

    console.log(allCategoryName.data);

    const formatBlog = blogs.data.map(b => {
      console.log(b.category[0]);
      return {
        id: b.blogId,
        blogContent: {
          title: b.title,
          content: getContent(b.content)
        },
        create_at: moment(b.create_at).fromNow(),
        thumbnail: getThumbnail(b.content),
        author: {
          username: b.create_by.username
        },
        tag: (allCategoryName.data?.find(v => v.categoryId === b.category[0]?.categoryId)) || 'ไม่มีแท็คจร้า',
      }
    })

    res.send({
      data: formatBlog,
      msg: 'success'
    })

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const getListFollowingBlog = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const userObjJWT = req.jwtObject as UserJwtPayload;

    const blogListResponse = await blogService._getListByFollowing({ author: userObjJWT.username })
    const allCategoryName = await _getAll()

    if (!blogListResponse.success) return res.status(httpStatus.internalServerError).send({ msg: blogListResponse.msg })

    const formatBlog = blogListResponse?.data?.map(b => {
      console.log(b.category[0]);
      return {
        id: b.blogId,
        blogContent: {
          title: b.title,
          content: getContent(b.content)
        },
        create_at: moment(b.create_at).fromNow(),
        thumbnail: getThumbnail(b.content),
        author: {
          username: b.create_by.username
        },
        tag: (allCategoryName.data?.find(v => v.categoryId === b.category[0]?.categoryId)) || 'ไม่มีแท็คจร้า',
      }
    }) || []


    res.send({
      data: formatBlog,
      msg: 'success'
    })

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export {
  newBlog,
  getOneBlog,
  getSuggestListBlog,
  getListUserBlog,
  getListCategoryBlog,
  getListFollowingBlog
}
