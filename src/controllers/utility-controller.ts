import type { Request, Response } from 'express';
import axios, { AxiosError } from 'axios'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config()

import { httpStatus } from '@config/http';
import defaultValue from '@config/defaultValue';
import { validateSchema } from '@helper/validateSchema';
import * as schema from '@model/ajvSchema'
import * as cateService from '@service/category-service'
import { Prisma } from '@prisma/client'
import { decodePassword } from '@util/DecryptEncryptString';
import { client, connectClient, quitClient } from '@config/redisConnect'

const getListCategory = async (req: Request, res: Response) => {
  try {

    const { limit, char } = req.query

    const xLimit = typeof limit?.toString() === 'string' ? +(limit.toString()) : undefined

    const categories = await cateService._getAll(xLimit, char?.toString())

    if (!categories.success || !categories.data) return res.status(httpStatus.internalServerError).send({ msg: categories.msg })

    if (limit) {
      const key = Object.entries(req.query).map(([k, v]) => {
        return `${'categories'}-${k}-${v}`
      }).join('-')

      client.setEx(key, 3600, JSON.stringify(categories.data))
    }

    res.send({ data: categories.data, msg: 'success' })

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export {
  getListCategory
}