import type { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config()

import { httpStatus } from '@config/http';
import { validateSchema } from '@helper/validateSchema';
import * as schema from '@model/ajvSchema'
import * as userService from '@service/user-service'

const signupWithEmail = async (req: Request, res: Response) => {
  try {
    const data = req.body

    const { success, msg } = validateSchema(schema.registerSchema, data)
    if (!success) return res.status(httpStatus.badRequest).send({ msg })

    const response = await userService._add(data)

    if (!response.success) return res.status(httpStatus.internalServerError).send(response)

    res.send(response)
  } catch (e) {
    console.error(e);
    res.sendStatus(httpStatus.internalServerError)
  }
}

const signInWithEmail = (req: Request, res: Response) => {
  try {
    res.sendStatus(httpStatus.notImplemented)
  } catch (error) {
    console.error(error);
    res.sendStatus(httpStatus.internalServerError)
  }
}

export {
  signupWithEmail,
  signInWithEmail
}
