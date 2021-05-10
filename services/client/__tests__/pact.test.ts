import { Pact, ApolloGraphQLInteraction, Matchers } from '@pact-foundation/pact'
import * as path from 'path'
import { gql } from '@apollo/client'
import { client } from '../src/client'

describe('Pact verifier', () => {
  const query = `
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
  const provider = new Pact({
    consumer: 'web-client',
    provider: 'appsync-gateway',
    dir: path.resolve(__dirname, 'pacts')
  })

  beforeAll(() => provider.setup())
  afterAll(() => provider.finalize())

  afterEach(() => provider.verify())

  const product = {
    id: Matchers.like('p1').contents,
    name: Matchers.like('some product').contents,
    price: Matchers.like(100).contents
  }

  const data = {
    allProducts: {
      edges: [
        {
          node: product,
          cursor: Matchers.like('string')
        }
      ]
    }
  }

  describe('products', () => {
    describe('get all products', () => {
      beforeEach(() => {
        const graphqlQuery = new ApolloGraphQLInteraction()
          .uponReceiving('a list of products')
          .withQuery(query)
          .willRespondWith({
            status: 200,
            body: {
              data
            }
          })
        return provider.addInteraction(graphqlQuery)
      })

      it('returns the correct response', async () => {
        const data = await client.query({
          // @ts-ignore puta
          query: gql(query)
        })

        expect(data).toEqual(data)
      })
    })
  })
})
