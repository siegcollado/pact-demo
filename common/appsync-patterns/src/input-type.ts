import * as appsync from '@aws-cdk/aws-appsync'

export enum InputTypeMode {
  create = 'Create',
  update = 'Update'
}

type InputTypeProps<TFieldNames extends string> = {
  type?: InputTypeMode,
  baseFields: Record<TFieldNames, appsync.IField>,
  includedFields: TFieldNames[]
}

const getInputTypeName = (type: InputTypeMode, name: string) => {
  return `${type}${name}Input`
}

export class InputType<TFieldNames extends string> extends appsync.InputType {
  constructor (name: string, props: InputTypeProps<TFieldNames>) {
    const {
      includedFields,
      baseFields,
      type = InputTypeMode.create
    } = props

    const definition = includedFields.reduce((acc, fieldName) => {
      return {
        ...acc,
        [fieldName]: baseFields[fieldName]
      }
    }, {})

    super(
      getInputTypeName(type, name),
      {
        definition: type === InputTypeMode.create
          ? definition
          : {
              ...definition,
              id: appsync.GraphqlType.id({ isRequired: true })
          }
      }
    )
  }
}
