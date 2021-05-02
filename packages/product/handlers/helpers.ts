// import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, APIGatewayEventRequestContext } from 'aws-lambda'

// export const client = new DynamoDB({ region: process.env.AWS_REGION })

const products = [
  {
    id: 'p1',
    price: 100.00,
    name: 'Product 1'
  },
  {
    id: 'p2',
    price: 200.00,
    name: 'Product 2'
  }
]

export const getProducts = async () => {
  // const results = await client.scan({
  //   TableName: process.env.TABLE_NAME
  // })

  return products
  // return results
}

export const getProduct = async (id: string) => {
  // const result = await client.getItem({
  //   TableName: process.env.TABLE_NAME,
  //   Key: { id: { N: id } }
  // })

  // return result
  return products.find((product) => product.id === id)
}

export type Handler = (event: APIGatewayProxyEventV2, context?: APIGatewayEventRequestContext) =>
  Promise<APIGatewayProxyResultV2>
