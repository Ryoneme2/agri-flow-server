import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config()

import { httpStatus } from '@config/http';
// import { _addUser, _getOne } from '@service/user-service';
// import { decodePassword } from '@util/DecryptEncryptString';

const signupWithEmail = (req: Request, res: Response) => {
  try {
    res.sendStatus(httpStatus.notImplemented)
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
