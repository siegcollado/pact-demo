import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'
import * as lambda from '@aws-cdk/aws-lambda'

export interface LambdaArnDataSourceProps extends Omit<appsync.LambdaDataSourceProps, 'lambdaFunction'> {
  lambdaFunctionArn: string
}

export class LambdaArnDataSource extends appsync.LambdaDataSource {
  public lambdaFunction: lambda.IFunction

  constructor (scope: cdk.Construct, id: string, props: LambdaArnDataSourceProps) {
    const { lambdaFunctionArn, ...rest } = props

    const lambdaFunction = lambda.Function.fromFunctionArn(
      scope,
      `${id}Function`,
      cdk.Fn.importValue(lambdaFunctionArn)
    )

    super(scope, id, {
      ...rest,
      lambdaFunction
    })

    this.lambdaFunction = lambdaFunction
  }
}


