import dotenv from 'dotenv';
import 'module-alias/register';
import express, { Express } from "express";
import { rateLimit } from 'express-rate-limit';
import cors from "cors";
dotenv.config()

import * as routes from './routes'

const app: Express = express()

// express server config
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(rateLimit({
  windowMs: 10000,
  max: 200,
  message: "Too many requests from this IP, please try again"
}))

app.use('/api/v1/auth', routes.authRoute)

app.get('/testGet', (_, res) => {
  res.status(200).send('Get success')
})

export default app
