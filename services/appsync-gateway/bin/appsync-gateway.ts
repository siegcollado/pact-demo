#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { AppsyncGatewayStack } from '../lib/appsync-gateway-stack'
import * as fs from 'fs'
import * as path from 'path'

const app = new cdk.App({ autoSynth: false })
new AppsyncGatewayStack(app, 'AppsyncGateway', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { account: '237418254525', region: 'ap-northeast-1' }
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
})

app.synth()

fs.readFile(path.join(__dirname, '../cdk.out/tree.json'), 'utf8', (err, data) => {
  if (err) {
    console.log(err)
    throw err
  }

  // not sure if this is the right way of going at this, eto lang nakikita ko sa internet e.
  const defn =
    JSON.parse(data).tree.children.AppsyncGateway.children.AppsyncGateway.children.Schema.attributes['aws:cdk:cloudformation:props'].definition

  fs.writeFile('schema.graphql', defn, (err) => {
    if (err) {
      console.log(err)
      throw err
    }
  })
})
