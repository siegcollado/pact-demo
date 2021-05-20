import * as cdk from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as lambdanode from '@aws-cdk/aws-lambda-nodejs'
import * as path from 'path'

export class OrderStack extends cdk.Stack {
  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const table = new dynamodb.Table(this, 'OrdersTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })

    const environment = {
      'TABLE_NAME': table.tableName
    }

    const getOrder = new lambdanode.NodejsFunction(this, 'GetOrderFunction', {
      entry: path.join(__dirname, '../handlers/get-order.ts'),
      environment
    })

    new cdk.CfnOutput(this, 'GetOrderFunctionArn', {
      exportName: 'GetOrderFunctionArn',
      value: getOrder.functionArn
    })

    table.grantReadData(getOrder)

    const createOrder = new lambdanode.NodejsFunction(this, 'CreateOrderFunction', {
      entry: path.join(__dirname, '../handlers/create-order.ts'),
      environment
    })

    new cdk.CfnOutput(this, 'CreateOrderFunctionArn', {
      exportName: 'CreateOrderFunctionArn',
      value: createOrder.functionArn
    })

    table.grantWriteData(createOrder)
  }
}
