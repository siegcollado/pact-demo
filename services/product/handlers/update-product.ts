import { updateProduct, Product } from './helpers'
import { logHandler } from './wrap-handler'

export type Event = {
  input: Product
}

export const handler = logHandler(
  async (event: Event) => {
    const { input } = event

    return await updateProduct(input)
  }
)
