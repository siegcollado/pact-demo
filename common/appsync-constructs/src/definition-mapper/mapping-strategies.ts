import * as appsync from '@aws-cdk/aws-appsync'
import { MappedFieldDefinition } from './types'
import { ObjectNode } from '../object-node'

export interface MappedFieldDefinitionOpts {
  object: ObjectNode,
  on: string
  dataSource: appsync.BaseDataSource,
  responseMappingTemplate?: appsync.MappingTemplate
}

export class ManyDefinitionMapping implements MappedFieldDefinition {
  public readonly on: string
  public readonly type: appsync.GraphqlType
  public readonly fieldResolver: appsync.ResolvableField

  constructor (options: MappedFieldDefinitionOpts) {
    this.on = options.on
    this.type = appsync.GraphqlType.id({ isList: true, isRequired: true })
    this.fieldResolver = new appsync.ResolvableField({
      returnType: options.object.attribute({ isList: true }),
      dataSource: options.dataSource,
      requestMappingTemplate: appsync.MappingTemplate.fromString(
        `
          #set ($args={})
          #set ($ids = $ctx.source.${this.on})
          $util.qr($args.put("id", $ids))

          {
            "version": "2017-02-28",
            "operation": "Invoke",
            "payload": $util.toJson($args)
          }
        `
      ),
      responseMappingTemplate: options.responseMappingTemplate
    })
  }
}

