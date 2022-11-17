import express from 'express'
import * as c from '@controller/utility-controller'
import * as redis from '@middleware/redis'

const route = express.Router()

route.get('/categories', redis.cacheByQuery, c.getListCategory)

export default route