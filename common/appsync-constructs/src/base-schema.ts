import * as appsync from '@aws-cdk/aws-appsync'
import { Node, PageInfo } from './common-relay-types'
import { ObjectNode } from './object-node'

export class BaseSchema extends appsync.Schema {
  constructor () {
    super()
    this.addType(Node)
    this.addType(PageInfo)
    // this.addQuery(`node`, new appsync.ResolvableField({
    //   args: {
    //     id: appsync.GraphqlType.id({ isRequired: true })
    //   },
    //   returnType: Node.attribute()
    // }))
  }

  addObjectNode (object: ObjectNode) {
    this.addType(object)
    this.addType(object.edge)
    this.addType(object.connection)
  }
}
