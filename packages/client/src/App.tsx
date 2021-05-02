import React from 'react'
import logo from './logo.svg'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { Products } from './Products'
import './App.css'

const client = new ApolloClient({
  uri: 'https://4jq7fx7hhng3dm3o2uv7mferre.appsync-api.ap-northeast-1.amazonaws.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    'X-Api-Key': 'da2-w2zcuvcsaneepmx73en7n23f3a'
  }
})

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Products />
    </ApolloProvider>
  )
}

export default App
