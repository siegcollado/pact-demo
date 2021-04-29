import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'

import {
  Order,
  Product,
  Record,
  NodeInterface,
  PageInfo,
  generateRelayConnectionType
} from './types'

const NAME = 'AppsyncGateway'

export class AwsAppsyncGateway extends cdk.Stack {

  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super (scope, id, props)

    const schema = new appsync.Schema()

    // base interfaces
    schema.addType(NodeInterface)
    schema.addType(Record)
    schema.addType(PageInfo)

    // other types
    schema.addType(Product)
    schema.addType(Record)

    const api = new appsync.GraphqlApi(this, NAME, {
      name: NAME,
      schema
    })
  }
}
