import { getProduct } from './helpers'
import { logHandler } from './wrap-handler'

export const handler = logHandler(
  (event: { id: string }) => getProduct(event.id)
)

