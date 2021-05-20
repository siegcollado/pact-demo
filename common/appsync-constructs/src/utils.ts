import * as appsync from '@aws-cdk/aws-appsync'
import * as pluralize from 'pluralize'

const capitalize = (name: string) => name.charAt(0).toLocaleUpperCase() + name.slice(1)

export function getAllQueryNameFor (object: appsync.ObjectType) {
  return `getAll${capitalize(pluralize(object.name))}`
}

export function getQueryNameFor (object: appsync.ObjectType) {
  return `get${capitalize(object.name)}`
}

export function createNameFor (object: appsync.ObjectType) {
  return `create${capitalize(object.name)}`
}

export function updateNameFor (object: appsync.ObjectType) {
  return `update${capitalize(object.name)}`
}
