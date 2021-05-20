import { Handler } from 'aws-lambda'

export const logHandler = <TEvent = unknown, TResult = unknown>(handler: Handler<TEvent, TResult>) => {
  const wrappedHandler: Handler<TEvent, TResult> = (event, context, ...rest) => {
    console.log('event', JSON.stringify(event, null, 2))
    console.log('context', JSON.stringify(context, null, 2))

    return handler(event, context, ...rest)
  }

  return wrappedHandler
}

