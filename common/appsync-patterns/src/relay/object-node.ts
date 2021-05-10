import * as appsync from '@aws-cdk/aws-appsync'
import * as pluralize from 'pluralize'
import { NodeInterface } from './node'
import { PageInfo } from './page-info'

export type ObjectNodeOptions = {
  baseOptions: appsync.ObjectTypeOptions
}

const appendNodeInterface = (interfaces: appsync.InterfaceType[] = []) => {
  if (interfaces.includes(NodeInterface)) {
    return interfaces
  }
  return interfaces.concat(NodeInterface)
}

export class ObjectNode extends appsync.ObjectType {

  public edgeType: appsync.ObjectType
  public connectionType: appsync.ObjectType
  public connectionResolver: appsync.ResolvableField

  constructor (name: string, { baseOptions }: ObjectNodeOptions) {
    super (name, {
      ...baseOptions,
      interfaceTypes: appendNodeInterface(baseOptions.interfaceTypes)
    })

    this.edgeType = new appsync.ObjectType(`${name}Edge`, {
      definition: {
        node: this.attribute(),
        cursor: appsync.GraphqlType.string()
      }
    })

    this.connectionType = new appsync.ObjectType(`${name}Connection`, {
      definition: {
        edges: this.edgeType.attribute({ isList: true, isRequired: true }),
        pageInfo: PageInfo.attribute()
      }
    })
  }

  public addToApi (api: appsync.GraphqlApi | appsync.Schema) {
    api.addType(this)
    api.addType(this.edgeType)
    api.addType(this.connectionType)
  }

  // private setupHasManyQuery (api: appsync.GraphqlApi | appsync.Schema) {
  //   const name = `all${pluralize(this.name)}`

  //   const connectionResolver = new resolver.ConnectionResolver(this.connectionType)

  //   api.addQuery(name, connectionResolver)
  // }
}
