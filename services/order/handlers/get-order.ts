import { getOrder } from './helpers'

export const handler = (event: { id: string }) => getOrder(event.id)
