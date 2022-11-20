import { SchemaObject } from 'ajv'

export const registerSchema: SchemaObject = {
  type: "object",
  properties: {
    password: { type: "string", minLength: 8 },
    email: { type: 'string', minLength: 1 },
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
    title: { type: "string", minLength: 1 },
    content: { type: "string", minLength: 1 },
    categories: { type: "array", uniqueItems: true }
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

export const newCommentSchema: SchemaObject = {
  type: "object",
  properties: {
    content: { type: "string" },
    blogId: { type: "string" }
  },
  required: [
    "content",
    "blogId"
  ],
  additionalProperties: false
}

export const newPostDiscussSchema: SchemaObject = {
  type: "object",
  properties: {
    content: { type: "string" },
  },
  required: [
    "content",
  ],
  additionalProperties: false
}

export const follow: SchemaObject = {
  type: "object",
  properties: {
    username: { type: "string" },
  },
  required: [
    "username",
  ],
  additionalProperties: false
}