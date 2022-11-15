import express from 'express'
import * as c from '@controller/user-controller'
import * as redis from '@middleware/redis'

const route = express.Router()

route.get('/:userUsername', c.getOne)

export default route