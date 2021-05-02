import * as appsync from '@aws-cdk/aws-appsync'
import * as pluralize from 'pluralize'
import * as relay from '../relay'
import * as templates from './templates'

export type ListItemsResolverOptions = {
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
      "query": $util.toJson($ctx.args),
      "headers": {
        "Content-Type": "application/json"
      }
    },
    "resourcePath": $util.toJson("/${resource}")
  }
  `
)

export class ListItemsResolver extends appsync.ResolvableField {
  private object: relay.ObjectNode

  constructor (options: ListItemsResolverOptions) {
    super({
      args: relay.defaultRelayArguments,
      returnType: options.objectNode.connectionType.attribute({ isRequired: true }),
      dataSource: options.dataSource,
      requestMappingTemplate: getRequestMappingTemplate(options.resource),
      responseMappingTemplate: templates.ListResponseTemplate
    })

    this.object = options.objectNode
  }

  get queryName () {
    return `all${pluralize(this.object.name)}`
  }
}
