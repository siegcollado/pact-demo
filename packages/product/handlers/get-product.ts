import { getProduct, Handler } from './helpers'

export const handler: Handler = async (event) => {
  const productId = event.pathParameters?.productId || null

  if (!productId) {
    return {
      statusCode: 200,
      body: JSON.stringify(null)
    }
  }

  const result = await getProduct(productId)

  return {
    statusCode: 200,
    body: JSON.stringify(result || null)
  }
}
