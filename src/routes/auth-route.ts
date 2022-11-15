import express from 'express'
import * as controller from '@controller/auth-controller'

const route = express.Router()

route.post('/loginSSO', controller.singleSignOn)
route.post('/login', controller.signInWithEmail)
route.post('/register', controller.signupWithEmail)
route.post('/resetPasswordRequest', controller.resetPassword)

export default route