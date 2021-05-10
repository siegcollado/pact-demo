import * as z from 'zod'
import { ZodJedlikModel } from '@pact-demo/zod-jedlik'
import { v4 } from 'uuid'

export const Product = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nullable()
})

export const ProductAttrs = Product.omit({ id: true })

export type Product = z.infer<typeof Product>
export type ProductAttrs = z.infer<typeof ProductAttrs>

const Products = new ZodJedlikModel({
  schema: Product,
  table: process.env.TABLE_NAME!
})

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const product = await Products.get({ id })
    return product.toObject()
  } catch (error) {
    return null
  }
}

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await Products.delete({ id })
    return true
  } catch {
    return false
  }
}

export const createProduct = async (input: ProductAttrs): Promise<Product> => {
  const product = Products.create({
    id: v4(),
    ...input
  })

  await product.save()
  return product.toObject()
}

export const updateProduct = async (input: Product): Promise<Product> => {
  const product = await Products.get({ id: input.id })

  if (!product) {
    throw new Error('Product not found.')
  }

  product.set({ ...input })

  await product.save()

  return product.toObject()
}
