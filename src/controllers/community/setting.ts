import { _addGroup } from '@service/community-service';
import { validateSchema } from '@helper/validateSchema';
import { httpStatus } from '@config/http';
import moment from 'moment';
import dotenv from 'dotenv';
import * as schema from '@model/ajvSchema'

import { Request, Response } from 'express';
import { IGetUserAuthInfoRequest, UserJwtPayload } from '@type/jwt';

dotenv.config();

export const newGroup = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {

    const { body, file } = req

    const valid = validateSchema(schema.newGroupSchema, body)

    const userObjJWT = req.jwtObject as UserJwtPayload

    if (!valid.success) return res.status(httpStatus.badRequest).send({ msg: valid.msg })

    const response = await _addGroup({
      author: userObjJWT.username,
      file,
      name: body.name
    })

    if (!response.success) return res.status(httpStatus.internalServerError).send({ msg: response.msg })

    res.sendStatus(httpStatus.created)

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