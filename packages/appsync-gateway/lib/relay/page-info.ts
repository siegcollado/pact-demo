import * as appsync from '@aws-cdk/aws-appsync'

export const PageInfo = new appsync.ObjectType('PageInfo', {
  definition: {
    hasNextPage: appsync.GraphqlType.boolean(),
    hasPreviousPage: appsync.GraphqlType.boolean(),
    startCursor: appsync.GraphqlType.string()
  }
})
