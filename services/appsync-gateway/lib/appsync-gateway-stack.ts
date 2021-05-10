import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'

import * as interfaces from './interfaces'
import * as common from '@pact-demo/appsync-patterns'
import { LambdaArnDataSource } from './lambda-arn-data-source'

export class AppsyncGatewayStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const schema = new appsync.Schema()

    const api = new appsync.GraphqlApi(this, 'AppsyncGateway', {
      name: 'AppsyncGateway',
      schema,
    })

    common.setupTypes(api)
    interfaces.setupInterfaces(api)

    const product = new common.Resource(this, 'ProductResource', {
      name: 'Product',
      api,
      fields: {
        price: appsync.GraphqlType.float(),
        name: appsync.GraphqlType.string({ isRequired: true })
      },
      resolvers: {
        delete: {
          dataSource: new LambdaArnDataSource(
            this,
            'DeleteProductDataSource',
            {
              api,
              lambdaFunctionArn: 'ProductStackDeleteFunctionArn'
            }
          )
        },
        get: {
          dataSource: new LambdaArnDataSource(
            this,
            'GetProductDataSource',
            {
              api,
              lambdaFunctionArn: 'ProductStackGetFunctionArn'
            }
          )
        },
        create: {
          dataSource: new LambdaArnDataSource(
            this,
            'CreateProductDataSource',
            {
              api,
              lambdaFunctionArn: 'ProductStackCreateFunctionArn'
            }
          ),
          inputFields: ['price', 'name']
        },
        update: {
          dataSource: new LambdaArnDataSource(
            this,
            'UpdateProductDataSource',
            {
              api,
              lambdaFunctionArn: 'ProductStackUpdateFunctionArn'
            }
          ),
          inputFields: ['price', 'name']
        },
        // getAll: {
        //   lambdaFunctionArn: cdk.Fn.importValue('ProductStackGetAllFunctionArn')
        // },
      }
    })
  }
}
