import * as cdk from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as path from 'path'
import { NodeJsFunctionWithOutput } from './node-function-with-output'

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
    const getProduct = new NodeJsFunctionWithOutput(this, 'ProductStackGetFunction', {
      entry: path.join(__dirname, '../handlers/get-product.ts'),
      environment
    })

    table.grantReadData(getProduct)

    // create
    const createProduct = new NodeJsFunctionWithOutput(this, 'ProductStackCreateFunction', {
      entry: path.join(__dirname, '../handlers/create-product.ts'),
      environment
    })

    table.grantReadWriteData(createProduct)

    // update
    const updateProduct = new NodeJsFunctionWithOutput(this, 'ProductStackUpdateFunction', {
      entry: path.join(__dirname, '../handlers/update-product.ts'),
      environment
    })

    table.grantReadWriteData(updateProduct)

    // delete
    const deleteProduct = new NodeJsFunctionWithOutput(this, 'ProductStackDeleteFunction', {
      entry: path.join(__dirname, '../handlers/delete-product.ts'),
      environment
    })

    table.grantReadWriteData(deleteProduct)

    // list
    const listProduct = new NodeJsFunctionWithOutput(this, 'ProductStackGetAllFunction', {
      entry: path.join(__dirname, '../handlers/list-products.ts'),
      environment
    })

    table.grantReadWriteData(listProduct)
  }
}

