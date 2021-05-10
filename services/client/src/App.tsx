import React from 'react'
import logo from './logo.svg'
import { ApolloProvider } from '@apollo/client'
import { Products } from './Products'
import { client } from './client'
import './App.css'

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Products />
    </ApolloProvider>
  )
}

export default App
