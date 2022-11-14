import { client, connectClient, quitClient } from '@config/redisConnect'
import { Request, Response, NextFunction } from 'express'
import { httpStatus } from '@config/http'

export const cacheByParam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectClient()

    const params = Object.entries(req.params)

    if (!params) return next()

    const key = params.map(([k, v]) => `${k}-${v}`).join('')

    const value = await client.get(key)

    res.status(httpStatus.ok).send({
      cached: true,
      data: value,
      msg: 'success get data'
    })
  } catch (e) {
    console.error(e);
  } finally {
    await quitClient()
  }
}