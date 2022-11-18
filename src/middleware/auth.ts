import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response, NextFunction } from 'express';
import { httpStatus } from '@config/http';
import type { UserJwtPayload, IGetUserAuthInfoRequest } from '@type/jwt'
dotenv.config();

const auth = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    console.log('auth middleware request');
    const token = req.header('Authorization');

    if (!token)
      return res.status(403).send({
        success: false,
        msg: 'Access denied.',
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserJwtPayload;
    req.jwtObject = decoded;

    next();
  } catch (e) {
    console.error(e);
    return res.status(httpStatus.internalServerError).send({
      msg: 'internal error'
    })
  }
}

export const authSoft = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    console.log('auth middleware request');
    const token = req.header('Authorization');

    if (!token) return next()

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserJwtPayload;
    req.jwtObject = decoded;
    next()
  } catch (e) {
    console.error(e);
    return next()
  }
}

export default auth