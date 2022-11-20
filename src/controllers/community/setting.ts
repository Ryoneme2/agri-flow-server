import { httpStatus } from '@config/http';
import moment from 'moment';
import dotenv from 'dotenv';

import { Request, Response } from 'express';
import { IGetUserAuthInfoRequest, UserJwtPayload } from '@type/jwt';

dotenv.config();

export const newGroup = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    res.send(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export const settingGroup = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    res.send(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export const deleteGroup = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    res.send(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}