import express from 'express'
const route = express.Router()
import * as c from '@controller/test'


route.get('/listUser', c.test)

export default route