import { client, connectClient, quitClient } from '@config/redisConnect'
import { Request, Response, NextFunction } from 'express'
import { httpStatus } from '@config/http'

export const cacheByParam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectClient()

    const params = Object.values(req.params)

    if (!params) return next()

    const value = await Promise.all(params.map(v => client.get(v)))

    if (value.every(v => v === null)) {
      next()
      return
    }

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