import { Response } from 'express';
import express from 'express'
import * as controller from '@controller/blog'
import auth, { authSoft } from '@middleware/auth'
import * as redis from '@middleware/redis'
import { updateBlogView } from '@middleware/updateBlogView'
import { IGetUserAuthInfoRequest } from '@type/jwt'

const route = express.Router()

route.post('/p', auth, controller.blogPerson.blog.newBlog)
route.post('/p/comments', auth, controller.blogPerson.comment.newComment)

route.get('/p/u/:username', controller.blogPerson.blog.getListUserBlog)
route.get('/p/:blogId', authSoft, updateBlogView, redis.cacheByParam, controller.blogPerson.blog.getOneBlog)
route.get('/p', authSoft, (req: IGetUserAuthInfoRequest, res: Response) => {
  const { type } = req.query
  const xquery = !type ? 'suggest' : type
  switch (xquery) {
    case 'suggest':
      controller.blogPerson.blog.getSuggestListBlog(req, res)
      break;
    case 'follow':
      controller.blogPerson.blog.getListFollowingBlog(req, res)
      break;
    case 'history':
      controller.blogPerson.blog.getListHistory(req, res)
      break;
    default:
      controller.blogPerson.blog.getSuggestListBlog(req, res)
      break;
  }
})
route.get('/p/tag/:categoryId', controller.blogPerson.blog.getListCategoryBlog)

route.get('/p/comments/:blogId', controller.blogPerson.comment.getBlogComment)

// community blog

route.post('/:communityId', auth, controller.blogCommunity.blog.newBlog)
route.post('/:communityId/:communityId/comments', auth, controller.blogCommunity.comment.newComment)

route.get('/:communityId/:blogId', authSoft, updateBlogView, redis.cacheByParam, controller.blogCommunity.blog.getOneBlog)
route.get('/:communityId', authSoft, (req: IGetUserAuthInfoRequest, res: Response) => {
  const { type } = req.query
  const xquery = !type ? 'suggest' : type
  switch (xquery) {
    case 'suggest':
      controller.blogCommunity.blog.getSuggestListBlog(req, res)
      break;
    case 'history':
      controller.blogCommunity.blog.getListHistory(req, res)
      break;
    default:
      controller.blogCommunity.blog.getSuggestListBlog(req, res)
      break;
  }
})
route.get('/:communityId/tag/:categoryId', controller.blogCommunity.blog.getListCategoryBlog)

route.get('/:communityId/comments/:blogId', controller.blogCommunity.comment.getBlogComment)


export default route