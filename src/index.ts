import dotenv from 'dotenv';
import 'module-alias/register';
import express, { Express, Response, NextFunction, Request } from "express";
import { rateLimit } from 'express-rate-limit';
import cors from "cors";
dotenv.config()

import * as routes from './routes'
import { connectClient } from '@config/redisConnect';

const app: Express = express()

const myApp = async () => {
  // express server config
  app.use(cors());
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(express.json({ limit: '50mb' }));
  app.use(rateLimit({
    windowMs: 10000,
    max: 200,
    message: "Too many requests from this IP, please try again"
  }))

  await connectClient()

  app.use('/api/v1/auth', routes.authRoute)
  app.use('/api/v1/blogs', routes.blogRoute)
  app.use('/api/v1/users', routes.userRoute)
  app.use('/api/v1/utilities', routes.utils)
  app.use('/api/v1/discusses', routes.discuss)
  app.use('/api/v1/communities', routes.community)

  app.use('/api/v1/test', routes.test)

  app.get('/testGet', (_, res) => {
    res.status(200).send('Get success')
  })

}

myApp()

export default app