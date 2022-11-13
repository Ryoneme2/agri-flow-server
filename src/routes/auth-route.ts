import express from 'express'
import * as controller from '@controller/auth-controller'

const route = express.Router()

route.post('/loginSSO', controller.singleSignOn)
route.post('/login', controller.signupWithEmail)
route.post('/register', controller.signInWithEmail)

export default route