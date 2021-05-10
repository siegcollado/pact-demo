import * as appsync from '@aws-cdk/aws-appsync'
import * as filtertypes from './base-types'

export type FilterTypeProps<TFieldName extends string> = {
  fields: Record<TFieldName, appsync.IField>,
  includedFields?: TFieldName[]
}

export class FilterType<TFieldName extends string> extends appsync.InputType {
  constructor (name: string, props: FilterTypeProps<TFieldName>) {
    const {
      fields,
      includedFields = Object.keys(fields) as TFieldName[]
    } = props

    const definition = includedFields.reduce((acc, fieldName) => {
      const field = fields[fieldName]

      const comparator = filtertypes.getComparator(field)

      if (!comparator) {
        return acc
      }

      return {
        ...acc,
        [fieldName]: comparator.attribute({ isRequired: false })
      }
    }, {})

    super(`${name}Filter`, { definition })
  }
}
