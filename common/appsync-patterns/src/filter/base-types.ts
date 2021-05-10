import * as appsync from '@aws-cdk/aws-appsync'

export enum FilterExpression {
  LIKE = 'like',
  EQUAL = 'eq',
  NOT_EQUAL = 'neq',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL = 'lte',
  GREATER_THAN_OR_EQUAL = 'gte',
  GREATER_THAN = 'gt'
}

export class Filter extends appsync.EnumType {
  constructor (name: string, definition: FilterExpression[]) {
    super(name, { definition })
  }
}

export const StringExpression = new Filter('StringFilterEnum', [
  FilterExpression.LIKE,
  FilterExpression.EQUAL,
  FilterExpression.NOT_EQUAL
])

export const BaseExpression = new Filter('BaseFilterEnum', [
  FilterExpression.EQUAL,
  FilterExpression.NOT_EQUAL
])

export const RangeExpression = new Filter('RangeFilterEnum', [
  FilterExpression.NOT_EQUAL,
  FilterExpression.EQUAL,
  FilterExpression.GREATER_THAN,
  FilterExpression.GREATER_THAN_OR_EQUAL,
  FilterExpression.LESS_THAN_OR_EQUAL,
  FilterExpression.LESS_THAN
])

export const StringComparator = new appsync.InputType('StringComparatorInput', {
  definition: {
    expression: StringExpression.attribute({ isRequired: true }),
    value: appsync.GraphqlType.string({ isRequired: true })
  }
})

export const IntComparator = new appsync.InputType('IntComparatorInput', {
  definition: {
    expression: RangeExpression.attribute({ isRequired: true }),
    value: appsync.GraphqlType.int({ isRequired: true })
  }
})

export const FloatComparator = new appsync.InputType('FloatComparatorInput', {
  definition: {
    expression: RangeExpression.attribute({ isRequired: true }),
    value: appsync.GraphqlType.float({ isRequired: true })
  }
})

export const BooleanComparator = new appsync.InputType('BooleanComparatorInput', {
  definition: {
    expression: BaseExpression.attribute({ isRequired: true }),
    value: appsync.GraphqlType.boolean({ isRequired: true })
  }
})

export const getComparator = (field: appsync.IField) => {
  switch (field.type) {
    case appsync.Type.STRING:
      return StringComparator
    case appsync.Type.BOOLEAN:
      return BooleanComparator
    case appsync.Type.FLOAT:
      return FloatComparator
    case appsync.Type.INT:
      return IntComparator
    default:
      return null
  }
}

