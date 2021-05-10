import { Handler } from 'aws-lambda'

export const logHandler = (handler: Handler) => {
  const wrappedHandler: Handler = (event, context, cb) => {
    console.log('event', JSON.stringify(event, null, 2))
    console.log('context', JSON.stringify(context, null, 2))

    return handler(event, context, cb)
  }

  return wrappedHandler
}

