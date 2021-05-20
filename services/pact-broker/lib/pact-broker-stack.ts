import * as cdk from '@aws-cdk/core'
import * as ec2 from "@aws-cdk/aws-ec2"
import * as ecs from "@aws-cdk/aws-ecs"
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns"

export class PactBrokerStack extends cdk.Stack {
  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const vpc = new ec2.Vpc(this, 'PactBroker', {
      maxAzs: 3,
    })

    const cluster = new ecs.Cluster(this, 'PactBrokerCluster', {
      vpc,
    })

    // Create a load-balanced Fargate service and make it public
    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "PactBrokerLoadBalancedService", {
      cluster,
      desiredCount: 1,
      cpu: 512,
      memoryLimitMiB: 2048,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('pactfoundation/pact-broker'),
        environment: {
          'PACT_BROKER_DATABASE_ADAPTER': 'sqlite',
          'PACT_BROKER_DATABASE_NAME': '/tmp/pact_broker.sqlite3',
          'PACT_BROKER_DISABLE_SSL_VERIFICATION': 'true'
        },
        containerPort: 9292,
      },
      publicLoadBalancer: true,
    })
  }
}
