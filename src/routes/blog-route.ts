import express from 'express'
import controller from '@controller/blog'
import auth, { authSoft } from '@middleware/auth'
import * as redis from '@middleware/redis'
import { updateBlogView } from '@middleware/updateBlogView'

const route = express.Router()

route.post('/p', auth, controller.blogPerson.newBlog)
route.get('/p/:blogId', authSoft, updateBlogView, redis.cacheByParam, controller.blogPerson.getOneBlog)
route.get('/p', auth, controller.blogPerson.getSuggestListBlog)

export default route