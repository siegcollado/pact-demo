import * as appsync from '@aws-cdk/aws-appsync'
import * as relay from './relay'
import * as interfaces from './interfaces'

export const Product = new relay.ObjectNode('Product', {
  baseOptions: {
    interfaceTypes: [interfaces.Record],
    definition: {
      price: appsync.GraphqlType.float(),
      name: appsync.GraphqlType.string({ isRequired: true })
    }
  }
})

export const Order = new relay.ObjectNode('Order', {
  baseOptions: {
    interfaceTypes: [interfaces.Record],
    definition: {
      product: Product.attribute()
    }
  }
})
