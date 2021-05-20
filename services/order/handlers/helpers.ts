import * as z from 'zod'
import { ZodJedlikModel } from '@pact-demo/zod-jedlik'
import { v4 } from 'uuid'

const isUnique = (items: string[]) => new Set(items).size === items.length

export const Order = z.object({
  id: z.string(),
  productIds: z.array(z.string()).refine(isUnique, {
    message: 'Products should not contain duplicates'
  })
})

export const OrderAttrs = Order.omit({ id: true })
export type Order = z.infer<typeof Order>
export type OrderAttrs = z.infer<typeof OrderAttrs>

const Orders = new ZodJedlikModel({
  table: process.env.TABLE_NAME!,
  schema: Order
})

export const getOrder = async (id: string): Promise<Order | null> => {
  try {
    const order = await Orders.get({ id })
    return order.toObject()
  } catch (error) {
    return null
  }
}

export const createOrder = async (input: OrderAttrs): Promise<Order> => {
  const order = Orders.create({
    id: v4(),
    ...input,
  })

  await order.save()
  return order.toObject()
}

