import * as appsync from '@aws-cdk/aws-appsync'

export const Record = new appsync.InterfaceType('Record', {
  definition: {
    createdAt: appsync.GraphqlType.awsDateTime()
  }
})

export const setupInterfaces = (api: appsync.GraphqlApi | appsync.Schema) => {
  api.addType(Record)
}
