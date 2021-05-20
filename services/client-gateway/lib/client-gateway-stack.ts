import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'
import * as common from '@pact-demo/appsync-constructs'

import * as interfaces from './interfaces'

export class ClientGatewayStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    const schema = new common.BaseSchema()

    const api = new appsync.GraphqlApi(this, 'ClientGateway', {
      name: 'ClientGateway',
      schema,
    })

    const product = new common.ObjectNode('Product', {
      definition: {
        price: appsync.GraphqlType.float(),
        name: appsync.GraphqlType.string({ isRequired: true })
      }
    })

    schema.addObjectNode(product)

    const getProductDatasource = new common.LambdaArnDataSource(this, 'GetProductDataSource', {
      lambdaFunctionArn: 'GetProductFunctionArn',
      api,
      name: 'GetProductDataSource'
    })

    schema.addQuery('getProduct', new appsync.ResolvableField({
      args: {
        id: appsync.GraphqlType.id({ isRequired: true })
      },
      returnType: product.attribute(),
      dataSource: getProductDatasource,
      requestMappingTemplate: appsync.MappingTemplate.lambdaRequest('$util.toJson($ctx.arguments)'),
      responseMappingTemplate: appsync.MappingTemplate.lambdaResult()
    }))

    const order = new common.ObjectNode('Order', {
      definition: {
        products: new common.ManyDefinitionMapping({
          on: 'productIds',
          dataSource: getProductDatasource,
          object: product
        })
      }
    })

    schema.addObjectNode(order)

    const getOrderDatasource = new common.LambdaArnDataSource(this, 'GetOrderDataSource', {
      lambdaFunctionArn: 'GetOrderFunctionArn',
      api,
      name: 'GetOrderDataSource'
    })

    schema.addQuery('getOrder', new appsync.ResolvableField({
      args: {
        id: appsync.GraphqlType.id({ isRequired: true })
      },
      returnType: order.attribute(),
      dataSource: getOrderDatasource,
      requestMappingTemplate: appsync.MappingTemplate.lambdaRequest('$util.toJson($ctx.arguments)'),
      responseMappingTemplate: appsync.MappingTemplate.lambdaResult()
    }))

    const createOrderInput = new common.InputType({
      object: order,
      type: common.InputTypeMode.create
    })

    const createOrderDatasource = new common.LambdaArnDataSource(this, 'CreateOrderDatasource', {
      lambdaFunctionArn: 'CreateOrderFunctionArn',
      api,
      name: 'CreateOrderDatasource'
    })

    schema.addType(createOrderInput)

    schema.addMutation('createOrder', new appsync.ResolvableField({
      returnType: order.attribute(),
      args: {
        input: createOrderInput.attribute({ isRequired: true })
      },
      dataSource: createOrderDatasource,
      requestMappingTemplate: appsync.MappingTemplate.lambdaRequest('$util.toJson($ctx.arguments)'),
      responseMappingTemplate: appsync.MappingTemplate.lambdaResult()
    }))
  }
}
