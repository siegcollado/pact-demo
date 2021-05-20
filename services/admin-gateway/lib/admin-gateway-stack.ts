import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'
import * as common from '@pact-demo/appsync-constructs'

export class AdminGatewayStack extends cdk.Stack {
  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const schema = new common.BaseSchema()

    const api = new appsync.GraphqlApi(this, 'AdminGateway', {
      name: 'AdminGateway',
      schema
    })

    const product = new common.ObjectNode('Product', {
      definition: {
        price: appsync.GraphqlType.float(),
        name: appsync.GraphqlType.string({ isRequired: true })
      }
    })

    const requestMappingTemplate = appsync.MappingTemplate.lambdaRequest('$util.toJson($ctx.arguments)')
    const responseMappingTemplate = appsync.MappingTemplate.lambdaResult()

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
      requestMappingTemplate,
      responseMappingTemplate
    }))

    const createProductInput = new common.InputType({
      object: product,
      type: common.InputTypeMode.create
    })

    schema.addType(createProductInput)

    const createProductDatasource = new common.LambdaArnDataSource(this, 'CreateProductDataSource', {
      lambdaFunctionArn: 'CreateProductFunctionArn',
      api,
      name: 'CreateProductDataSource'
    })

    schema.addMutation('createProduct', new appsync.ResolvableField({
      args: {
        input: createProductInput.attribute({ isRequired: true })
      },
      returnType: product.attribute({ isRequired: true }),
      dataSource: createProductDatasource,
      requestMappingTemplate,
      responseMappingTemplate
    }))

    const updateProductInput = new common.InputType({
      object: product,
      type: common.InputTypeMode.update
    })

    schema.addType(updateProductInput)

    const updateProductDatasource = new common.LambdaArnDataSource(this, 'UpdateProductDataSource', {
      lambdaFunctionArn: 'UpdateProductFunctionArn',
      api,
      name: 'UpdateProductDataSource'
    })

    schema.addMutation('updateProduct', new appsync.ResolvableField({
      args: {
        input: updateProductInput.attribute({ isRequired: true })
      },
      returnType: product.attribute({ isRequired: true }),
      dataSource: updateProductDatasource,
      requestMappingTemplate,
      responseMappingTemplate
    }))
  }
}
