import * as redis from 'redis'
import dotenv from 'dotenv'
dotenv.config()

const host = process.env.REDIS_HOST

const client = redis.createClient({
  url: `rediss://default:${process.env.REDIS_PASSWORD}@${host}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
})

const connectClient = async () => {
  return await client.connect()
}

const quitClient = async () => {
  return await client.quit()
}

export {
  client,
  connectClient,
  quitClient
}