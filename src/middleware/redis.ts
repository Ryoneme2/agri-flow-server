import { client, connectClient, quitClient } from '@config/redisConnect'
import { Request, Response, NextFunction } from 'express'
import { httpStatus } from '@config/http'
import url from 'url'

export const cacheByParam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = Object.entries(req.params)

    if (!params) return next()

    const key = params.map(([k, v]) => `${k}-${v}`).join('')

    const value = await client.get(key)

    if (value === null) return next()

    return res.status(httpStatus.ok).send({
      cached: true,
      data: JSON.parse(value),
      msg: 'success get data'
    })

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}

export const cacheByQuery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = Object.entries(req.query)
    console.log(url.pathToFileURL);

    // if (!params) return next()

    // const key = params.map(([k, v]) => `${k}-${v}`).join('')

    // const value = await client.get(key)

    // if (value === null) return next()

    // return res.status(httpStatus.ok).send({
    //   cached: true,
    //   data: JSON.parse(value),
    //   msg: 'success get data'
    // })
    next()

  } catch (e) {
    console.error(e);
    return res.sendStatus(httpStatus.internalServerError)
  }
}