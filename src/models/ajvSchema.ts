import { SchemaObject } from 'ajv'

export const registerSchema: SchemaObject = {
  type: "object",
  properties: {
    password: { type: "string", minLength: 8 },
    email: { type: 'string' },
    username: { type: "string", minLength: 5 }
  },
  required: [
    "username",
    "password",
    "email"
  ],
  additionalProperties: false
}

export const registerSSOSchema: SchemaObject = {
  type: "object",
  properties: {
    token: { type: "string" },
  },
  required: [
    "token",
  ],
  additionalProperties: { "type": "object" }
}

export const loginSchema: SchemaObject = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" }
  },
  required: [
    "email",
    "password"
  ],
  additionalProperties: { "type": "object" }
}

export const newPostSchema: SchemaObject = {
  type: "object",
  properties: {
    title: { type: "string" },
    content: { type: "string" }
  },
  required: [
    "title",
    "content"
  ],
  additionalProperties: false
}

export const resetPassword: SchemaObject = {
  type: "object",
  properties: {
    token: { type: "string" },
    password: { type: "string" }
  },
  required: [
    "token",
    "password"
  ],
  additionalProperties: false
}