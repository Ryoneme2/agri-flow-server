import * as redis from 'redis'
import dotenv from 'dotenv'
dotenv.config()

const host = process.env.REDIS_HOST

const client = redis.createClient({
  // url: `redis://${host}:${process.env.REDIS_PORT}`,
  url: 'redis://default:U78JUhXNpqNCep30DmhQ@containers-us-west-21.railway.app:7110',
  password: process.env.REDIS_PASSWORD,
})

const connectClient = async () => {
  await client.connect()
}

const quitClient = async () => {
  await client.quit()
}

export {
  client,
  connectClient,
  quitClient
}