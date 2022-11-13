import express from 'express'
import controller from '@controller/blog'
import auth from '@middleware/auth'

const route = express.Router()

route.post('/p', auth, controller.blogPerson.newBlog)

export default route