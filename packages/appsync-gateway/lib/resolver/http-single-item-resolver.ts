import * as appsync from '@aws-cdk/aws-appsync'
import * as relay from '../relay'
import * as templates from './templates'

export type SingleItemResolverOptions = {
  objectNode: relay.ObjectNode
  resource: string,
  dataSource: appsync.HttpDataSource
}

const getRequestMappingTemplate = (resource: string) => appsync.MappingTemplate.fromString(
  `
  {
    "version": "2018-05-29",
    "method": "GET",
    "params": {
      "headers": {
        "Content-Type": "application/json"
      }
    },
    "resourcePath": $util.toJson("/${resource}/\${ctx.args.id}")
  }
  `
)

export class SingleItemResolver extends appsync.ResolvableField {
  private object: relay.ObjectNode

  constructor (options: SingleItemResolverOptions) {
    super({
      args: {
        id: appsync.GraphqlType.id({ isRequired: true })
      },
      returnType: options.objectNode.attribute({ isRequired: false }),
      dataSource: options.dataSource,
      requestMappingTemplate: getRequestMappingTemplate(options.resource),
      responseMappingTemplate: templates.SingleResponseTemplate
    })

    this.object = options.objectNode
  }

  public get queryName () {
    return `get${this.object.name}`
  }
}
