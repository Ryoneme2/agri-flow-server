import express from 'express'
import * as c from '@controller/utility-controller'
import * as redis from '@middleware/redis'
import auth, { authSoft } from '@middleware/auth'

const route = express.Router()

route.get('/categories', redis.cacheByQuery, c.getListCategory)
route.post('/categories', auth, c.newCategory)

export default route