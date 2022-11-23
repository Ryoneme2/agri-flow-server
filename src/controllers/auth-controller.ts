import sendMail from '@helper/sendMail';
import type { Request, Response } from 'express';
import axios, { AxiosError } from 'axios'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config()

import { httpStatus } from '@config/http';
import defaultValue from '@config/defaultValue';
import { validateSchema } from '@helper/validateSchema';
import * as schema from '@model/ajvSchema'
import * as userService from '@service/user-service'
import { Prisma } from '@prisma/client'
import { decodePassword } from '@util/DecryptEncryptString';

type GoogleUserResponse = {
  issued_to: string;
  audience: string;
  user_id: string;
  scope: string;
  expires_in: number;
  email: string;
  verified_email: boolean;
  access_type: string;
}

const singleSignOn = async (req: Request, res: Response) => {
  try {
    const data = req.body
    const { success, msg } = validateSchema(schema.registerSSOSchema, data)
    if (!success) return res.status(httpStatus.badRequest).send({ msg })

    const userData = await axios.get<GoogleUserResponse>(`https://www.googleapis.com/oauth2/v2/tokeninfo?access_token=${data.token}`)

    const user = await userService._getOne({ username: userData.data.user_id })

    if (user === null) {
      const resAddedUser = await userService._add({ username: userData.data.user_id, password: null, email: userData.data.email, imageProfile: defaultValue.blankImage })
      if (!resAddedUser.success) return res.sendStatus(httpStatus.internalServerError)
    }

    const secret = process.env.JWT_SECRET;

    if (!secret)
      return res.status(httpStatus.internalServerError).send({
        message: 'the key is not found',
      });

    const token = jwt.sign(
      {
        username: userData.data.user_id,
        email: userData.data.email,
      },
      secret
    );

    res.send({
      data: {
        token,
      }
    })

  } catch (e) {
    console.error(e);
    if (e instanceof AxiosError) {
      return res.status(httpStatus.badRequest).send({
        msg: e.response?.data.error_description || 'error something about token'
      })
    }
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const singleSignOnLine = async (req: Request, res: Response) => {
  try {
    const data = req.body
    // const { success, msg } = validateSchema(schema.registerSSOSchema, data)
    // if (!success) return res.status(httpStatus.badRequest).send({ msg })

    console.log({ data });

    // const userData = await axios.post(`https://api.line.me/oauth2/v2.1/verify`, { id_token: data.token, client_id: 1657675273 })
    const userData = await axios.post(
      'https://api.line.me/oauth2/v2.1/verify',
      new URLSearchParams({
        'id_token': data.token,
        'client_id': '1657675273'
      })
    );

    // console.log({ userData });

    const user = await userService._getOne({ username: userData.data.name })

    console.log({ user: user.data });


    await userService._add({ username: userData.data.name, password: null, email: null, imageProfile: userData.data.picture })
    // if (!resAddedUser.success) return res.sendStatus(httpStatus.internalServerError)

    // console.log({ resAddedUser });


    const secret = process.env.JWT_SECRET;

    if (!secret)
      return res.status(httpStatus.internalServerError).send({
        message: 'the key is not found',
      });

    const token = jwt.sign(
      {
        username: userData.data.name,
        email: null,
      },
      secret
    );

    res.send({
      data: {
        token,
        user: {
          imageProfile: userData.data.picture,
          username: userData.data.name
        }
      }
    })

  } catch (e) {
    console.error(e);
    if (e instanceof AxiosError) {
      return res.status(httpStatus.badRequest).send({
        msg: e.response?.data.error_description || 'error something about token'
      })
    }
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const signupWithEmail = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body

    const { success, msg } = validateSchema(schema.registerSchema, { username, email, password })
    if (!success) return res.status(httpStatus.badRequest).send({ msg })

    const mailRegex = new RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/)

    const validMail = mailRegex.test(email)

    if (!validMail) return res.status(httpStatus.badRequest).send({ msg: 'email not valid' })

    const response = await userService._add({ username, email, password })

    if (!response.success) return res.status(httpStatus.internalServerError).send(response)

    res.send(response)
  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const signInWithEmail = async (req: Request, res: Response) => {
  try {

    const data = req.body

    const { success, msg } = validateSchema(schema.loginSchema, data)

    if (!success) return res.status(httpStatus.badRequest).send({ msg })

    const user = await userService._getOneMail({ mail: data.email })

    if (!user.success) return res.status(httpStatus.internalServerError).send({
      msg: 'Something went wrong with getOne user service'
    })
    if (!user.data) return res.status(httpStatus.forbidden).send({
      msg: 'user not found',
    });
    if (user?.data?.password === undefined || user?.data?.password === null) return res.status(httpStatus.internalServerError).send({
      msg: 'password not match'
    })

    const isPasswordMatch = await decodePassword(data.password, user.data.password);

    if (data.email !== user.data?.email || !isPasswordMatch)
      return res.status(httpStatus.forbidden).send({
        msg: 'username or password not match',
      });

    const secret = process.env.JWT_SECRET;

    if (!secret)
      return res.send({
        status: httpStatus.internalServerError,
        data: null,
        message: 'the key is not found',
      });

    const token = jwt.sign(
      {
        username: user.data.username,
        email: user.data.email,
      },
      secret
    );

    res.send({
      data: {
        token,
        user: {
          imageProfile: user.data.imageProfile,
          username: user.data.username
        }
      }
    })

  } catch (error) {
    console.error(error);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

const resetPassword = async (req: Request, res: Response) => {
  try {

    const data: {
      token: string,
      password: string
    } = req.body

    if (!process.env.JWT_SECRET) throw new Error('no jwt secret')

    const valid = validateSchema(schema.resetPassword, data)

    if (!valid.success) return res.status(httpStatus.badRequest).send({ msg: valid.msg })

    const decoded = jwt.verify(data.token, process.env.JWT_SECRET) as {
      email: string
    }

    const dataResponse = await userService._updatePassByEmail({ email: decoded.email, pass: data.password })

    if (!dataResponse.success) return res.status(httpStatus.internalServerError).send(dataResponse)

    res.sendStatus(httpStatus.created)

  } catch (e) {
    console.error(e);

    return res.sendStatus(httpStatus.internalServerError)
  }
}

const resetPasswordRequest = async (req: Request, res: Response) => {
  try {

    const { email } = req.body

    const mailRegex = new RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/)

    const validMail = mailRegex.test(email)

    if (!validMail) return res.status(httpStatus.badRequest).send({ msg: 'invalid email' })

    const token = jwt.sign({
      email,
      validToken: true
    }, process.env.JWT_SECRET || '', {
      expiresIn: 1000 * 60 * 60 * 2 // 2 hour
    })

    const host = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://agri-flow-client.vercel.app/login/reset-password'

    const user = await userService._getOneMail({ mail: email })

    if (!user.data) return res.status(httpStatus.unauthorized).send({
      msg: 'no user found check our email again'
    })

    const mail = await sendMail.forgetPass(email, `${host}?token=${token}`)

    if (!mail.success) return res.status(httpStatus.badRequest).send(mail)

    res.send(mail)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export {
  signupWithEmail,
  signInWithEmail,
  singleSignOn,
  resetPasswordRequest,
  resetPassword, singleSignOnLine
}
