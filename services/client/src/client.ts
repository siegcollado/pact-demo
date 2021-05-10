import { ApolloClient, InMemoryCache } from '@apollo/client'

export const createClient = (uri: string) => new ApolloClient({
  uri,
  cache: new InMemoryCache(),
  headers: {
    'X-Api-Key': 'da2-w2zcuvcsaneepmx73en7n23f3a'
  }
})

export const client = createClient('https://4jq7fx7hhng3dm3o2uv7mferre.appsync-api.ap-northeast-1.amazonaws.com/graphql')
