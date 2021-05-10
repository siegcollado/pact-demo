import * as appsync from '@aws-cdk/aws-appsync'

export const NodeInterface = new appsync.InterfaceType('Node', {
  definition: {
    id: appsync.GraphqlType.id({ isRequired: true })
  }
})
