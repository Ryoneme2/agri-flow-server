import { _getHistoryList } from '@service/blog/person/blog-service';
import type { Response, Request } from 'express';
import type { IGetUserAuthInfoRequest, UserJwtPayload } from '@type/jwt'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config()

import { httpStatus } from '@config/http';
import { validateSchema } from '@helper/validateSchema';
import * as schema from '@model/ajvSchema'
import * as blogService from '@service/blog/person/blog-service'
import moment from 'moment';
import { client } from '@config/redisConnect';
import { _getAllFollowing, _getOne, _getOneAll } from '@service/user-service';
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

    const response = await blogService._add({ author: userObjJWT?.username, title: data.title, content: data.content, categories: data.categories })

    if (!response.success) return res.status(httpStatus.badRequest).send(response)

    res.sendStatus(httpStatus.created)

  } catch (error) {
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const getOneBlog = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const { blogId } = req.params

    const userObjJWT = req.jwtObject as UserJwtPayload;
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

    const following = await _getAllFollowing({ author: userObjJWT?.username })
    const format = {
      blogContent: {
        title: blog.data.title,
        content: blog.data.content
      },
      isPublic: !blog.data.isSpacial ? true : false,
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
        isFollow: !userObjJWT?.username ? false : following.data.includes(blog.data.create_by.username),
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
    const following = await _getAllFollowing({ author: userObjJWT?.username })

    if (!blogs.data) return res.send({ msg: 'no blog found' })

    const formatBlog = blogs.data.blogs.map(b => {
      return {
        id: b.blogId,
        blogContent: {
          title: b.title,
          content: getContent(b.content)
        },
        isPublic: !b.isSpacial ? true : false,
        create_at: moment(b.create_at).fromNow(),
        thumbnail: getThumbnail(b.content),
        author: {
          isFollow: !userObjJWT?.username ? false : following.data.includes(b.create_by.username),
          username: b.create_by.username,
          isVerify: b.create_by.isVerify,
          imageProfile: b.create_by.imageProfile
        },
        tag: allCategoryName.data?.find(v => v.categoryId === b.category[0]?.categoryId) || {
          categoryName: 'ไม่มีแท็คจร้า', categoryId: null
        },
      }
    })

    res.send({
      data: formatBlog,
      pagination: {
        hasMore: (blogs.data.blogs.length || 0) <= (blogs.data?.blogCount || 0),
        countItems: (blogs.data?.blogCount || 0)
      }
    })

  } catch (e) {
    console.error(e);
    res.sendStatus(httpStatus.internalServerError)
  }
}

const getListUserBlog = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const { username } = req.params

    const blogs = await blogService._getUserBlogList({ username })

    const userObjJWT = req.jwtObject as UserJwtPayload;
    const allCategoryName = await _getAll()

    if (!blogs.data) return res.send({ msg: 'no blog found' })
    const following = await _getAllFollowing({ author: userObjJWT?.username })

    console.log(allCategoryName.data);

    const formatBlog = blogs.data.blogs.map(b => {
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
          isFollow: !userObjJWT?.username ? false : following.data.includes(b.create_by.username),
          username: b.create_by.username,
          imageProfile: b.create_by.imageProfile,
          isVerify: b.create_by.isVerify
        },
        tag: (allCategoryName.data?.find(v => v.categoryId === b.category[0]?.categoryId)) || 'ไม่มีแท็คจร้า',
      }
    })

    res.send({
      data: formatBlog,
      pagination: {
        hasMore: (blogs?.data.blogs.length || 0) <= (blogs?.data?.blogCount || 0),
      },
      msg: 'success'
    })

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const getListCategoryBlog = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const { skip, limit } = req.query
    const { categoryId } = req.params

    const xLimit = !limit ? 3 : +limit.toString()
    const xSkip = !skip ? 3 : +skip.toString()

    const userObjJWT = req.jwtObject as UserJwtPayload;
    const blogs = await blogService._getListByCategory({ tagId: +categoryId, limit: xLimit, skip: xSkip })

    const following = await _getAllFollowing({ author: userObjJWT?.username })

    console.log({ following });

    const allCategoryName = await _getAll()

    if (!blogs.data) return res.send({ msg: 'no blog found' })

    console.log(allCategoryName.data);

    const formatBlog = blogs.data.blogs.map(b => {
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
          isFollow: !userObjJWT?.username ? false : following.data.includes(b.create_by.username),
          username: b.create_by.username,
          imageProfile: b.create_by.imageProfile,
          isVerify: b.create_by.isVerify
        },
        tag: (allCategoryName.data?.find(v => v.categoryId === b.category[0]?.categoryId)) || 'ไม่มีแท็คจร้า',
      }
    })

    res.send({
      data: formatBlog,
      pagination: {
        hasMore: (blogs?.data.blogs.length || 0) <= (blogs?.data?.count || 0),
      },
      msg: 'success'
    })

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const getListFollowingBlog = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    if (!req.jwtObject) return res.sendStatus(httpStatus.unauthorized)
    const userObjJWT = req.jwtObject as UserJwtPayload;

    const { data, success, msg } = await blogService._getListByFollowing({ author: userObjJWT?.username })
    const allCategoryName = await _getAll()

    const following = await _getAllFollowing({ author: userObjJWT?.username })

    if (!success) return res.status(httpStatus.internalServerError).send({ msg })

    const formatBlog = data?.blogs?.map(b => {
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
          isFollow: !userObjJWT?.username ? false : following.data.includes(b.create_by.username),
          username: b.create_by.username,
          isVerify: b.create_by.isVerify,
          imageProfile: b.create_by.imageProfile
        },
        tag: (allCategoryName.data?.find(v => v.categoryId === b.category[0]?.categoryId)) || 'ไม่มีแท็คจร้า',
      }
    }) || []


    res.send({
      data: formatBlog,
      pagination: {
        hasMore: (data?.blogs.length || 0) <= (data?.count || 0),
        countItems: (data?.count || 0)
      },
      msg: 'success'
    })

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const getListHistory = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const { limit, skip } = req.query

    if (!req.jwtObject) return res.sendStatus(httpStatus.unauthorized)

    const userObjJWT = req.jwtObject as UserJwtPayload
    const allCategoryName = await _getAll()
    const blogs = await _getHistoryList({ author: userObjJWT?.username, limit: +(limit?.toString() || '3'), skip: +(skip?.toString() || '0') })
    const following = await _getAllFollowing({ author: userObjJWT?.username })

    const formatBlog = blogs?.data?.map(b => {
      return {
        id: b.blogId,
        blogContent: {
          title: b.title,
          content: getContent(b.content)
        },
        create_at: moment(b.create_at).fromNow(),
        thumbnail: getThumbnail(b.content),
        author: {
          isFollow: !userObjJWT?.username ? false : following.data.includes(b.create_by.username),
          username: b.create_by.username,
          isVerify: b.create_by.isVerify,
          imageProfile: b.create_by.imageProfile
        },
        tag: (allCategoryName.data?.find(v => v.categoryId === b.category[0]?.categoryId)) || 'ไม่มีแท็คจร้า',
      }
    }) || []

    res.send({
      data: formatBlog,
      pagination: {
        hasMore: (blogs.count || 0) >= (blogs.data?.length || 0),
        countItems: blogs.count || 0
      },
      msg: ''
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
  getListFollowingBlog,
  getListHistory
}
