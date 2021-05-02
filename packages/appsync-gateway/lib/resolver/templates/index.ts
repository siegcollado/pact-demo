import * as appsync from '@aws-cdk/aws-appsync'
import * as path from 'path'

export const SingleResponseTemplate = appsync
  .MappingTemplate
  .fromFile(path.resolve(__dirname, 'single-item-response.vtl'))

export const ListResponseTemplate = appsync
  .MappingTemplate
  .fromFile(path.resolve(__dirname, 'list-item-response.vtl'))


