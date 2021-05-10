import { logHandler } from './wrap-handler'
type ProductFilter = {
  name: {
    expression: string,
    value: number,
  },
  price: {
    expression: string,
    value: number
  }
}

export const handler = logHandler(
  async (event: ProductFilter, context) => {
    return {
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null
      },
      edges: []
    }
  }
)

