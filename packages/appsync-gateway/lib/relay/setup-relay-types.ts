import * as appsync from '@aws-cdk/aws-appsync'
import { NodeInterface } from './node'
import { PageInfo } from './page-info'

export function setupRelayTypes (api: appsync.GraphqlApi | appsync.Schema) {
  api.addType(NodeInterface)
  api.addType(PageInfo)
}
