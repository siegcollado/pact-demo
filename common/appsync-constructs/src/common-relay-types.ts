import * as appsync from '@aws-cdk/aws-appsync'

export const Node = new appsync.InterfaceType('Node', {
  definition: {
    id: appsync.GraphqlType.id({ isRequired: true })
  }
})

export const PageInfo = new appsync.ObjectType('PageInfo', {
  definition: {
    hasNextPage: appsync.GraphqlType.boolean(),
    hasPreviousPage: appsync.GraphqlType.boolean(),
    startCursor: appsync.GraphqlType.string(),
    endCursor: appsync.GraphqlType.string()
  }
})

