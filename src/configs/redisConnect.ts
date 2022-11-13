import * as redis from 'redis'
import dotenv from 'dotenv'
dotenv.config()

const host = process.env.NODE_ENV === 'production' ? 'cache' : '127.0.0.1'

const client = redis.createClient({
  url: `redis://${host}:6379`,
  password: process.env.PASSWORD,
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