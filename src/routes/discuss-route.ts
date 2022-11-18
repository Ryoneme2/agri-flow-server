import express from 'express'
import * as controller from '@controller/blog'
import auth, { authSoft } from '@middleware/auth'
import * as redis from '@middleware/redis'
import { updateBlogView } from '@middleware/updateBlogView'

const route = express.Router()

// add post, get suggest, get by id, edit, delete

export default route
