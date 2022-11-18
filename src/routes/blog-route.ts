import express from 'express'
import * as controller from '@controller/blog'
import auth, { authSoft } from '@middleware/auth'
import * as redis from '@middleware/redis'
import { updateBlogView } from '@middleware/updateBlogView'

const route = express.Router()

route.post('/p', auth, controller.blogPerson.blog.newBlog)
route.post('/p/comments', auth, controller.blogPerson.comment.newComment)

route.get('/p/:blogId', authSoft, updateBlogView, redis.cacheByParam, controller.blogPerson.blog.getOneBlog)
route.get('/p', authSoft, controller.blogPerson.blog.getSuggestListBlog)
route.get('/p/tag/:categoryId', controller.blogPerson.blog.getListCategoryBlog)

export default route