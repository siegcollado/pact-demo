import { getProducts, Handler } from './helpers'

export const handler: Handler = async (event) => {
  const results = await getProducts()

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: results,
      count: results.length
    })
  }
}
