import * as appsync from '@aws-cdk/aws-appsync'

export const Record = new appsync.InterfaceType('Record', {
  definition: {
    createdAt: appsync.GraphqlType.awsDateTime()
  }
})
