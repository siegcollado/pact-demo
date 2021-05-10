import { createProduct, ProductAttrs } from './helpers'
import { logHandler } from './wrap-handler'

export type Event = {
  input: ProductAttrs
}

export const handler = logHandler(
  async (event: Event) => {
    const { input } = event

    try {
      return await createProduct(input)
    } catch (e) {
      throw new Error('Unable to create product, provide better errors.')
    }
  }
)

