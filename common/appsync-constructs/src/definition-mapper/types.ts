import * as appsync from '@aws-cdk/aws-appsync'

export interface MappedFieldDefinition {
  on: string,
  type: appsync.IField,
  fieldResolver: appsync.ResolvableField
}

export interface FieldDefinition {
  [key: string]: appsync.IField | MappedFieldDefinition
}
