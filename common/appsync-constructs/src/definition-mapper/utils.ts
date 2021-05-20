import * as appsync from '@aws-cdk/aws-appsync'
import * as types from './types'

export const isAMappedFieldDefinition = (value: unknown): value is types.MappedFieldDefinition => {
  const { hasOwnProperty } = Object.prototype

  return ['on', 'type', 'fieldResolver'].every((prop) => hasOwnProperty.call(value, prop))
}

type DefinitionBuilderCb = (key: string, mapping: types.MappedFieldDefinition) => { [key: string]: appsync.IField }

export const createDefinitionMapper = (mappingFunction: DefinitionBuilderCb) => {
  return (definition: types.FieldDefinition): { [key: string]: appsync.IField } =>
    Object.entries(definition).reduce(
      (prev, [key, mapping]) => {
        if (!isAMappedFieldDefinition(mapping)) {
          return {
            ...prev,
            [key]: mapping
          }
        }

        return {
          ...prev,
          ...mappingFunction(key, mapping)
        }
      },
      {}
    )
}

export const mapDefinition = createDefinitionMapper((key, mapping) => {
  return {
    [key]: mapping.fieldResolver
  }
})

export const mapMutationDefinition = createDefinitionMapper((_, mapping) => {
  const { on, type } = mapping

  return {
    [on]: type
  }
})
