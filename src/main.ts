#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable import/extensions */

/**
 * This is a sample HTTP server.
 * Replace this with your implementation.
 */

import 'dotenv/config'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import { createUser, getUser, getUsers } from './data'

// The GraphQL schema
export const typeDefs = `#graphql
  type User {
      id: Int
      user_account_number: Int
      user_bank_code: Int
      user_account_name: String
  }

  type Mutation {
    createUser(
      user_account_number: String!
      user_bank_code: String!
      user_account_name: String!
    ): User
  }

  type Query {
    user(
      bank_code: String!,
      account_number: String!
    ): User
    users: [User]
  }
`

// A map of functions which return data for the schema.
export const resolvers = {
  Query: {
    user: getUser,
    users: getUsers,
  },
  Mutation: {
    createUser: createUser,
  },
}

const startServer = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  // Set up Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
  await server.start()

  app.use(cors(), bodyParser.json(), expressMiddleware(server))

  try {
    await new Promise(() => httpServer.listen({ port: 4000 }))
    console.log(`🚀 Server ready at http://localhost:4000`)
  } catch (error) {
    console.error(`❌ Server failed to start: ${error}`)
  }
}

startServer().catch(error => {
  console.error(error)
  process.exitCode = 1
})
