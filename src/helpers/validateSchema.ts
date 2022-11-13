import Ajv, { Schema } from 'ajv'
const ajv = new Ajv()

export const validateSchema = (schema: string | Schema, data: any) => {
  const valid = ajv.validate(schema, data)

  console.log({ valid, data });

  if (!valid) return { success: false, msg: ajv.errors }

  return { success: true, msg: ajv.errors }
}