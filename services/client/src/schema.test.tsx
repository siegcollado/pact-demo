import { getIntrospectionQuery } from 'graphql'

describe('schema matches', () => {
  let responseSchema: unknown

  beforeAll(async () => {
    try {
      const data = await fetch('https://4jq7fx7hhng3dm3o2uv7mferre.appsync-api.ap-northeast-1.amazonaws.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'da2-w2zcuvcsaneepmx73en7n23f3a'
        },
        body: JSON.stringify({ query: getIntrospectionQuery() })
      })
      responseSchema = await data.json()
    } catch (e) {
      throw e
    }
  })

  it('matches snapshot', () => {
    expect(responseSchema).toMatchSnapshot()
  })
})

