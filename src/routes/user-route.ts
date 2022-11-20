import auth from '@middleware/auth';
import express from 'express'
import * as c from '@controller/user-controller'
import * as redis from '@middleware/redis'

const route = express.Router()

route.get('/:userUsername', redis.cacheByParam, c.getOne)
route.post('/follows', auth, c.follow)

export default route