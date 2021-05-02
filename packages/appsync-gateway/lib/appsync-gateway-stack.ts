import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'
import * as ssm from '@aws-cdk/aws-ssm'

import * as interfaces from './interfaces'
import * as objects from './objects'
import * as relay from './relay'
import * as resolver from './resolver'

export class AppsyncGatewayStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const schema = new appsync.Schema()

    const api = new appsync.GraphqlApi(this, 'AppsyncGateway', {
      name: 'AppsyncGateway',
      schema
    })

    // this is important
    relay.setupRelayTypes(schema)
    interfaces.setupInterfaces(schema)

    objects.Order.addToApi(schema)
    objects.Product.addToApi(schema)

    const productDataSource = new appsync.HttpDataSource(this, `${objects.Product.name}DataSource`, {
      api,
      endpoint: ssm.StringParameter.valueFromLookup(this, 'product-stack-url')
    })

    const singleProductResolver = new resolver.SingleItemResolver({
      objectNode: objects.Product,
      resource: 'product',
      dataSource: productDataSource
    })

    schema.addQuery(singleProductResolver.queryName, singleProductResolver)

    const listProductResolver = new resolver.ListItemsResolver({
      objectNode: objects.Product,
      resource: 'products',
      dataSource: productDataSource
    })

    schema.addQuery(listProductResolver.queryName, listProductResolver)
  }
}
