import * as cdk from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as lambdanode from '@aws-cdk/aws-lambda-nodejs'
import * as apigateway from '@aws-cdk/aws-apigatewayv2'
import * as integration from '@aws-cdk/aws-apigatewayv2-integrations'
import * as log from '@aws-cdk/aws-logs'
import * as ssm from '@aws-cdk/aws-ssm'
import * as path from 'path'

export class ProductStack extends cdk.Stack {
  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const api = new apigateway.HttpApi(this, 'products-api', {
      createDefaultStage: true,
    })

    const logGroup = new log.LogGroup(this, 'ProductLogGroup', {
      retention: log.RetentionDays.ONE_WEEK,
    })

    // https://github.com/aws/aws-cdk/issues/11100#issuecomment-782213423
    const stage = api.defaultStage?.node.defaultChild as apigateway.CfnStage
    stage.accessLogSettings = {
      destinationArn: logGroup.logGroupArn,
      format: JSON.stringify({
        requestId: '$context.requestId',
        ip: '$context.identity.sourceIp',
        caller: '$context.identity.caller',
        user: '$context.identity.user',
        requestTime: '$context.requestTime',
        httpMethod: '$context.httpMethod',
        resourcePath: '$context.resourcePath',
        status: '$context.status',
        protocol: '$context.protocol',
        responseLength: '$context.responseLength'
      })
    }

    const table = new dynamodb.Table(this, 'products', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
    })

    const listProducts = new lambdanode.NodejsFunction(this, 'list-products', {
      entry: path.join(__dirname, '../handlers/list-products.ts'),
      handler: 'handler',
    })

    table.grantReadData(listProducts)
    listProducts.addEnvironment('TABLE_NAME', table.tableName)

    api.addRoutes({
      path: '/products',
      methods: [apigateway.HttpMethod.GET],
      integration: new integration.LambdaProxyIntegration({
        handler: listProducts
      })
    })

    const getProduct = new lambdanode.NodejsFunction(this, 'get-product', {
      entry: path.join(__dirname, '../handlers/get-product.ts'),
      handler: 'handler'
    })

    table.grantReadData(getProduct)
    getProduct.addEnvironment('TABLE_NAME', table.tableName)

    api.addRoutes({
      path: '/product/{productId}',
      methods: [apigateway.HttpMethod.GET],
      integration: new integration.LambdaProxyIntegration({
        handler: getProduct
      })
    })

    new ssm.StringParameter(this, 'product-stack-url', {
      type: ssm.ParameterType.STRING,
      tier: ssm.ParameterTier.STANDARD,
      stringValue: api.url!,
      parameterName: 'product-stack-url'
    })
  }
}

