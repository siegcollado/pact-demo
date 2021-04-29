import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'
import * as path from 'path'

const dummyRequest = appsync.MappingTemplate.fromFile(path.join(__dirname, 'mapping-templates', 'empty-request.vtl'))

const dummyResponse = appsync.MappingTemplate.fromFile(path.join(__dirname, 'mapping-templates', 'empty-response.vtl'))

export class AppsyncGatewayStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const api = new appsync.GraphqlApi(this, 'AppsyncGateway', {
      name: 'AppsyncGateway',
    })

    const film = new appsync.ObjectType('Film', {
      definition: {
        title: appsync.GraphqlType.string(),
        id: appsync.GraphqlType.id({ isRequired: true }),
        releaseDate: appsync.GraphqlType.awsDate()
      }
    })

    api.addQuery('allFilms', new appsync.ResolvableField({
      returnType: film.attribute({ isList: true }),
      args: {
        after: appsync.GraphqlType.string(),
        first: appsync.GraphqlType.int(),
        before: appsync.GraphqlType.string(),
        last: appsync.GraphqlType.int()
      },
      requestMappingTemplate: dummyRequest,
      responseMappingTemplate: dummyResponse
    }))

    api.addType(film)
  }
}
