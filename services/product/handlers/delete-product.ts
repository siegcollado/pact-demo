import { logHandler } from './wrap-handler'
import { deleteProduct } from './helpers'

type Event = {
  id: string
}

export const handler = logHandler(
  (event: Event) => deleteProduct(event.id)
)
