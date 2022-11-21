import express from 'express'
import * as controller from '@controller/blog/community/setting'
import auth, { authSoft } from '@middleware/auth'
import * as redis from '@middleware/redis'
import { upload } from '@config/uploadFileConfig';
const route = express.Router()

route.post('/', upload.single('file'), auth, controller.newGroup)

export default route