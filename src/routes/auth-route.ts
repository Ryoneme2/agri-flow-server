import express from 'express'
import * as controller from '@controller/auth-controller'

const route = express.Router()

route.post('/loginSSO', controller.singleSignOn)
route.post('/loginSSOLine', controller.singleSignOnLine)
route.post('/login', controller.signInWithEmail)
route.post('/register', controller.signupWithEmail)
route.post('/resetPasswordRequest', controller.resetPasswordRequest)
route.post('/resetPass', controller.resetPassword)

export default route