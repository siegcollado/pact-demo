import * as appsync from '@aws-cdk/aws-appsync'

export const NodeInterface = new appsync.InterfaceType('Node', {
  definition: {
    id: appsync.GraphqlType.id({ isRequired: true })
  }
})

/**
 * an object class that automatically implments NodeInterface.
 */
export class ObjectNode extends appsync.ObjectType {

  private static appendNodeInterface (interfaces: appsync.InterfaceType[] = []) {
    if (interfaces.includes(NodeInterface)) {
      return interfaces
    }

    return interfaces.concat(NodeInterface)
  }

  constructor (name: string, options: appsync.ObjectTypeOptions) {
    super(name, {
      ...options,
      interfaceTypes: ObjectNode.appendNodeInterface(options.interfaceTypes)
    })
  }
}

export const PageInfo = new appsync.ObjectType('PageInfo', {
  definition: {
    hasNextPage: appsync.GraphqlType.boolean(),
    hasPreviousPage: appsync.GraphqlType.boolean(),
    startCursor: appsync.GraphqlType.string(),
    endCursor: appsync.GraphqlType.string()
  }
})

export const generateRelayConnectionType = (node: ObjectNode) => {
  const edge = new appsync.ObjectType(`${node.name}Edge`, {
    definition: {
      node: node.attribute(),
      cursor: appsync.GraphqlType.string()
    }
  })

  const connection = new appsync.ObjectType(`${node.name}Connection`, {
    definition: {
      edges: edge.attribute({ isList: true, isRequired: true }),
      pageInfo: PageInfo.attribute(),
    }
  })

  return { edge, connection }
}

