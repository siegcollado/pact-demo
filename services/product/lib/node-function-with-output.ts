import * as cdk from '@aws-cdk/core'
import * as lambdanode from '@aws-cdk/aws-lambda-nodejs'

export class NodeJsFunctionWithOutput extends lambdanode.NodejsFunction {
  public cfnOutput: cdk.CfnOutput

  constructor (scope: cdk.Construct, id: string, props: lambdanode.NodejsFunctionProps) {
    super(scope, id, {
      ...props,
    })

    const exportName = `${id}Arn`

    this.cfnOutput = new cdk.CfnOutput(scope, exportName, {
      exportName,
      value: this.functionArn
    })
  }
}
