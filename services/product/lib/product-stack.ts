import * as cdk from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as lambdanode from '@aws-cdk/aws-lambda-nodejs'
import * as path from 'path'

export class ProductStack extends cdk.Stack {
  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const table = new dynamodb.Table(this, 'ProductsTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
    })

    const environment = {
      'TABLE_NAME': table.tableName
    }

    // get
    const getProduct = new lambdanode.NodejsFunction(this, 'GetProductFunction', {
      entry: path.join(__dirname, '../handlers/get-product.ts'),
      environment
    })

    new cdk.CfnOutput(this, 'GetProductFunctionArn', {
      exportName: 'GetProductFunctionArn',
      value: getProduct.functionArn
    })

    table.grantReadData(getProduct)

    // create
    const createProduct = new lambdanode.NodejsFunction(this, 'CreateProductFunction', {
      entry: path.join(__dirname, '../handlers/create-product.ts'),
      environment
    })

    new cdk.CfnOutput(this, 'CreateProductFunctionArn', {
      exportName: 'CreateProductFunctionArn',
      value: createProduct.functionArn
    })

    table.grantReadWriteData(createProduct)

    // update
    const updateProduct = new lambdanode.NodejsFunction(this, 'UpdateProductFunction', {
      entry: path.join(__dirname, '../handlers/update-product.ts'),
      environment
    })

    new cdk.CfnOutput(this, 'UpdateProductFunctionArn', {
      exportName: 'UpdateProductFunctionArn',
      value: updateProduct.functionArn
    })

    table.grantReadWriteData(updateProduct)

    // delete
    const deleteProduct = new lambdanode.NodejsFunction(this, 'DeleteProductFunction', {
      entry: path.join(__dirname, '../handlers/delete-product.ts'),
      environment
    })

    new cdk.CfnOutput(this, 'DeleteProductFunctionArn', {
      exportName: 'DeleteProductFunctionArn',
      value: updateProduct.functionArn
    })

    table.grantReadWriteData(deleteProduct)

    // // list
    // const listProduct = new NodeJsFunctionWithOutput(this, 'ProductStackGetAllFunction', {
    //   entry: path.join(__dirname, '../handlers/list-products.ts'),
    //   environment
    // })

    // table.grantReadWriteData(listProduct)
  }
}

