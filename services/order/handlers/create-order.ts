import { OrderAttrs, createOrder } from './helpers'

export const handler = async (event: { input: OrderAttrs }) => {
  const { input } = event

  try {
    return await createOrder(input)
  } catch (e) {
    throw new Error('Unable to create order.')
  }
}
