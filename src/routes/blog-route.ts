import express from 'express'
import controller from '@controller/blog'
import auth from '@middleware/auth'
import * as redis from '@middleware/redis'

const route = express.Router()

route.post('/p', auth, controller.blogPerson.newBlog)
route.get('/p/:blogId', redis.cacheByParam, controller.blogPerson.getOneBlog)

export default route