import { ApolloServer } from '@apollo/server'
import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs, resolvers } from '../src/main'
import assert from 'assert'

it('returns all users', async () => {
  const testServer = new ApolloServer({
    schema: addMocksToSchema({
      schema: makeExecutableSchema({ typeDefs, resolvers }),
    }),
  })

  const response = await testServer.executeOperation({
    query: `query users {
            user_account_name
            user_account_number
            user_bank_code
          }`,
  })

  assert(response.body.kind === 'incremental')
})

it('fail to return a user', async () => {
  const testServer = new ApolloServer({
    schema: addMocksToSchema({
      schema: makeExecutableSchema({ typeDefs, resolvers }),
    }),
  })

  const response = await testServer.executeOperation({
    query: `query user(bank_code: $bankCode, account_number: $accountNumber) {
            user_account_name
            user_account_number
            user_bank_code
          }`,
    variables: {
      bankCode: '044',
      accountNumber: '0690000032',
    },
  })

  // expect(response.body.initalResult).toBeNull();
  console.log(response)
})
