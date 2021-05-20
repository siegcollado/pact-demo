import * as appsync from '@aws-cdk/aws-appsync'
import * as types from './types'

export function isAMappedFieldDefinition (value: unknown): value is types.MappedFieldDefinition {
  const { hasOwnProperty } = Object.prototype

  return ['on', 'type', 'fieldResolver'].every((prop) => hasOwnProperty.call(value, prop))
}

export function mapDefinition (defn: types.FieldDefinition): { [key: string]: appsync.IField } {
  return Object.entries(defn).reduce(
    (prev, [key, mapping]) => {
      if (!isAMappedFieldDefinition(mapping)) {
        return {
          ...prev,
          [key]: mapping
        }
      }

      return {
        ...prev,
        [key]: mapping.fieldResolver
      }
    },
    {}
  )
}

export function mapMutationDefinition (defn: types.FieldDefinition): { [key: string]: appsync.IField } {
  return Object.entries(defn).reduce(
    (prev, [key, mapping]) => {
      if (!isAMappedFieldDefinition(mapping)) {
        return {
          ...prev,
          [key]: mapping
        }
      }

      const { on, type } = mapping

      return {
        ...prev,
        [on]: type
      }
    },
    {}
  )
}

