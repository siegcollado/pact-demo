import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'
import * as pluralize from 'pluralize'

import * as relay from './relay'
import * as input from './input-type'
import * as filter from './filter'

export interface ResolverConfig {
  name?: string,
  dataSource?: appsync.BaseDataSource
}

export interface MutationResolverConfig <TFields extends string> extends ResolverConfig {
  inputFields: TFields[]
}

export type ResourceProps<TFieldName extends string> = {
  api: appsync.GraphqlApi,
  name: string,
  interfaceTypes?: appsync.InterfaceType[],
  fields: Record<TFieldName, appsync.IField>,
  resolvers?: {
    get: ResolverConfig,
    getAll?: ResolverConfig,
    create?: MutationResolverConfig<TFieldName>,
    update?: MutationResolverConfig<TFieldName>,
    delete?: ResolverConfig
  }
}

const requestMappingTemplate = appsync.MappingTemplate.lambdaRequest('$util.toJson($ctx.arguments)')
const responseMappingTemplate = appsync.MappingTemplate.lambdaResult()

export class Resource <TFields extends string> extends cdk.Construct {
  public object: relay.ObjectNode
  public name: string

  constructor (scope: cdk.Construct, id: string, props: ResourceProps<TFields>) {
    super(scope, id)

    const {
      fields,
      name,
      api,
      interfaceTypes = [],
      resolvers
    } = props

    this.name = name

    this.object = new relay.ObjectNode(props.name, {
      baseOptions: {
        definition: fields,
        interfaceTypes
      }
    })

    this.object.addToApi(api)

    if (resolvers?.get) {
      const {
        dataSource,
        name: getName = `get${name}`
      } = resolvers.get

      const singleItemResolver = new appsync.ResolvableField({
        args: {
          id: appsync.GraphqlType.id({ isRequired: true })
        },
        responseMappingTemplate,
        requestMappingTemplate,
        returnType: this.object.attribute({ isRequired: false }),
        dataSource
      })

      api.addQuery(getName, singleItemResolver)
    }

    if (resolvers?.delete) {
      const {
        dataSource,
        name: deleteName = `delete${name}`
      } = resolvers.delete

      const deleteResolver = new appsync.ResolvableField({
        args: {
          id: appsync.GraphqlType.id({ isRequired: true })
        },
        responseMappingTemplate,
        requestMappingTemplate,
        returnType: appsync.GraphqlType.boolean({ isRequired: false }),
        dataSource
      })

      api.addMutation(deleteName, deleteResolver)
    }

    if (resolvers?.create) {
      const {
        dataSource,
        inputFields,
        name: createName = `create${name}`
      } = resolvers.create

      const inputType = new input.InputType(name, {
        baseFields: fields,
        includedFields: inputFields,
        type: input.InputTypeMode.create
      })

      const createMutation = new appsync.ResolvableField({
        args: {
          input: inputType.attribute({ isRequired: true })
        },
        returnType: this.object.attribute({ isRequired: true }),
        requestMappingTemplate,
        responseMappingTemplate,
        dataSource,
      })

      api.addType(inputType)
      api.addMutation(createName, createMutation)
    }

    if (resolvers?.update) {
      const {
        dataSource,
        inputFields,
        name: updateName = `update${name}`
      } = resolvers.update

      const inputType = new input.InputType(name, {
        baseFields: fields,
        includedFields: inputFields,
        type: input.InputTypeMode.update
      })

      const updateMutation = new appsync.ResolvableField({
        args: {
          input: inputType.attribute({ isRequired: true })
        },
        returnType: this.object.attribute({ isRequired: true }),
        requestMappingTemplate,
        responseMappingTemplate,
        dataSource
      })

      api.addType(inputType)
      api.addMutation(updateName, updateMutation)
    }

    if (resolvers?.getAll) {
      const {
        dataSource,
        name: getAllName = `getAll${pluralize(name)}`
      } = resolvers.getAll

      const filterType = new filter.FilterType(name, {
        fields
      })

      const listItemsResolver = new appsync.ResolvableField({
        args: {
          ...relay.defaultRelayArguments,
          filter: filterType.attribute({ isRequired: false })
        },
        returnType: this.object.connectionType.attribute({ isRequired: true }),
        dataSource,
        requestMappingTemplate: appsync.MappingTemplate.lambdaRequest('$util.toJson($ctx.arguments)'),
        responseMappingTemplate: appsync.MappingTemplate.lambdaResult()
      })

      api.addType(filterType)

      api.addQuery(getAllName, listItemsResolver)
    }
  }
}
