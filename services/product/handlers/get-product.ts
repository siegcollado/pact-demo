import { getProduct } from './helpers'
import { logHandler } from './wrap-handler'

type Event = {
  id: string | string[]
}

export const handler = logHandler(
  async (event: Event) => {
    const { id } = event

    if (Array.isArray(id)) {
      return await Promise.all(
        id.map(singleId => getProduct(singleId))
      )
    }

    return await getProduct(id)
  }
)

