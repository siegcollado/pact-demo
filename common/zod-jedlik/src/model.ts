import * as z from 'zod'
import * as jedlik from '@peak-ai/jedlik'

export type Validator<T> = (value: any) => {
  value: T,
  error?: {
    name: string,
    details: { message: string }[]
  }
}

export interface ZodJedlikModelProps <T> extends Omit<jedlik.ModelOptions<T>, 'schema'> {
  schema: z.ZodType<T>
}

export class ZodJedlikModel<T> extends jedlik.Model<T> {
  private validator: Validator<T>

  constructor (props: ZodJedlikModelProps<T>, serviceConfig?: jedlik.ServiceConfig) {
    const { schema, table } = props

    const validator: Validator<T> = (value: any) => {
      const result = schema.safeParse(value)

      if (result.success) {
        return {
          value: result.data
        }
      }

      return {
        value,
        error: {
          name: result.error.name,
          details: result.error.issues
        }
      }
    }

    super ({ table, schema: { validate: validator }}, serviceConfig)

    this.validator = validator
  }

  validate (value: any) {
    return this.validator(value)
  }
}
