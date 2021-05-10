import * as appsync from '@aws-cdk/aws-appsync'

export const defaultRelayArguments = {
  after: appsync.GraphqlType.string(),
  first: appsync.GraphqlType.int(),
  before: appsync.GraphqlType.string(),
  last: appsync.GraphqlType.int()
}
