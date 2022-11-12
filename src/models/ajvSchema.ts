import { Schema } from 'ajv'

export const registerSchema: Schema = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
    email: { type: "string" }
  },
  required: [
    "username",
    "password",
  ],
  additionalProperties: { "type": "object" }
}

export const registerSSOSchema: Schema = {
  type: "object",
  properties: {
    token: { type: "string" },
  },
  required: [
    "token",
  ],
  additionalProperties: { "type": "object" }
}