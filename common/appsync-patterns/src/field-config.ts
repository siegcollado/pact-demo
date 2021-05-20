import * as appsync from '@aws-cdk/aws-appsync'

export type MappingOptions = {
  sourceAttribute: string,
  resource: appsync.ResolvableField,
}

export type FieldMapping = appsync.IField | MappingOptions

export type FieldConfigProps = Record<string, FieldMapping>

const isMappingOption = (item: unknown): item is MappingOptions => {
  const { hasOwnProperty } = Object.prototype

  return hasOwnProperty.call(item, 'sourceAttribute') && hasOwnProperty.call(item, 'resource')
}

export class FieldConfig {
  public readonly definition: Record<string, appsync.IField>

  constructor (fieldConfig: FieldConfigProps) {
    this.definition = Object.keys(fieldConfig).reduce((result, key) => {
      const item = fieldConfig[key]

      if (isMappingOption(item)) {
        return {
          ...result,
          [key]:
        }
      }

      return {
        ...result,
        [key]: item
      }
    }, {})
  }
}
