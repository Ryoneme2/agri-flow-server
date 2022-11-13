import type { Request, Response } from 'express';
import axios, { AxiosError } from 'axios'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config()

import { httpStatus } from '@config/http';
import { validateSchema } from '@helper/validateSchema';
import * as schema from '@model/ajvSchema'
import * as userService from '@service/user-service'
import { Prisma } from '@prisma/client'
import { decodePassword } from '@util/DecryptEncryptString';

type GoogleUserResponse = {
  iss: string;
  nbf: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}

const singleSignOn = async (req: Request, res: Response) => {
  try {
    const data = req.body
    const { success, msg } = validateSchema(schema.registerSSOSchema, data)
    if (!success) return res.status(httpStatus.badRequest).send({ msg })

    const userData = await axios.get<GoogleUserResponse>(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${data.token}`)

    const user = await userService._getOne({ username: userData.data.name })

    if (user === null) {
      const resAddedUser = await userService._add({ username: userData.data.name, password: null, email: userData.data.email, imageProfile: userData.data.picture })
      if (!resAddedUser.success) return res.sendStatus(httpStatus.internalServerError)
    }

    const secret = process.env.JWT_SECRET;

    if (!secret)
      return res.status(httpStatus.internalServerError).send({
        message: 'the key is not found',
      });

    const token = jwt.sign(
      {
        username: userData.data.name,
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
      }
    })


    res.sendStatus(httpStatus.notImplemented)
  } catch (error) {
    console.error(error);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export {
  signupWithEmail,
  signInWithEmail,
  singleSignOn
}
