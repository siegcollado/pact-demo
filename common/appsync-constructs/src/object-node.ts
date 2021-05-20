import * as appsync from '@aws-cdk/aws-appsync'
import * as common from './common-relay-types'
import * as mapping from './definition-mapper'

const appendNodeInterface = (interfaces: appsync.InterfaceType[] = []) => {
  if (interfaces.includes(common.Node)) {
    return interfaces
  }
  return interfaces.concat(common.Node)
}

export interface ObjectNodeOptions extends Omit<appsync.ObjectTypeOptions, 'definition'> {
  definition: mapping.FieldDefinition
}

export class ObjectNode extends appsync.ObjectType {

  public readonly edge = new appsync.ObjectType(`${this.name}Edge`, {
    definition: {
      node: this.attribute(),
      cursor: appsync.GraphqlType.string()
    }
  })

  public readonly connection = new appsync.ObjectType(`${this.name}Connection`, {
    definition: {
      edges: this.edge.attribute({ isList: true, isRequired: true }),
      pageInfo: common.PageInfo.attribute()
    }
  })

  public mutationDefinition: { [key: string]: appsync.IField }

  constructor (name: string, options: ObjectNodeOptions) {
    super(name, {
      ...options,
      definition: mapping.mapDefinition(options.definition),
      interfaceTypes: appendNodeInterface(options.interfaceTypes)
    })

    this.mutationDefinition = mapping.mapMutationDefinition(options.definition)
  }
}

