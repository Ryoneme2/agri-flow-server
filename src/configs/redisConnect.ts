import * as redis from 'redis'
import dotenv from 'dotenv'
dotenv.config()


const client = redis.createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
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