import * as appsync from '@aws-cdk/aws-appsync'

/**
 * an interface that implements createdAt
 */
export const Record = new appsync.InterfaceType('Record', {
  definition: {
    createdAt: appsync.GraphqlType.awsDateTime()
  }
})
