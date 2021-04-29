import * as appsync from '@aws-cdk/aws-appsync'
import { ObjectNode, Record } from '../type-helpers'

export const Product = new ObjectNode('Product', {
  interfaceTypes: [Record],
  definition: {
    price: appsync.GraphqlType.float(),
    name: appsync.GraphqlType.string({ isRequired: true })
  }
})

export const Order = new ObjectNode('Order', {
  interfaceTypes: [Record],
  definition: {
    products: Product.attribute({ isList: true })
  }
})
