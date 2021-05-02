import React from 'react'
import { useQuery, gql } from '@apollo/client'

const query = gql`
query GetProducts {
  allProducts {
    edges {
      node {
        price
        name
        id
      }
    }
  }
}
`

type Results = {
  allProducts: {
    edges: Array<{
      node: { id: string, name: string, price: number },
      cursor: string
    }>
  }
}

export const Products: React.FC = () => {
  const { data, loading } = useQuery<Results>(query)

  if (loading) {
    return (<div>Loading</div>)
  }

  const products = (data?.allProducts.edges ?? []).map((product) => {
    return (
      <div key={product.cursor}>
        <span>{product.node.id}: Cursor: {product.cursor}</span>
        <span>Name: {product.node.name}, price {product.node.price}</span>
      </div>
    )
  })

  return (
    <div>
      {products}
    </div>
  )
}
