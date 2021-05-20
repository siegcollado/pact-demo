import * as appsync from '@aws-cdk/aws-appsync'
import { ObjectNode } from './object-node'

export enum InputTypeMode {
  create = 'Create',
  update = 'Update'
}

export interface InputTypeProps {
  object: ObjectNode,
  type?: InputTypeMode
}

const getInputTypeName = (type: InputTypeMode, name: string) => `${type}${name}Input`

export class InputType extends appsync.InputType {
  constructor (props: InputTypeProps) {
    const {
      object,
      type = InputTypeMode.create
    } = props


    super(
      getInputTypeName(type, object.name),
      {
        definition: type === InputTypeMode.create
          ? object.mutationDefinition
          : {
            ...object.mutationDefinition,
            id: appsync.GraphqlType.id({ isRequired: true })
          }
      }
    )
  }
}

