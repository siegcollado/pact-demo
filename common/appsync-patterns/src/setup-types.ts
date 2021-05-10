import * as appsync from '@aws-cdk/aws-appsync'
import { NodeInterface, PageInfo } from './relay'
import {
  StringExpression,
  RangeExpression,
  BaseExpression,

  StringComparator,
  BooleanComparator,
  FloatComparator,
  IntComparator
} from './filter'

export function setupTypes (api: appsync.GraphqlApi | appsync.Schema) {
  api.addType(NodeInterface)
  api.addType(PageInfo)

  api.addType(StringExpression)
  api.addType(RangeExpression)
  api.addType(BaseExpression)

  api.addType(StringComparator)
  api.addType(BooleanComparator)
  api.addType(FloatComparator)
  api.addType(IntComparator)
}
