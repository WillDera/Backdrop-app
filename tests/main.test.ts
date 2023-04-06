import { ApolloServer } from '@apollo/server';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs, resolvers } from '../src/main';
import assert from 'assert';
import request from 'supertest';
import { createUser } from '../src/data';
import { distance } from 'fastest-levenshtein';
import { resolveAccount } from '../src/resolver';
import { User } from '../src/interface';

it('return all users', async () => {
    const testServer = new ApolloServer({
        schema: addMocksToSchema({
            schema: makeExecutableSchema({ typeDefs, resolvers })
        })
    })

    const queryData = {
        query: `query exampleUsers {
            users {
                user_account_name
                user_account_number
                user_bank_code
            }
          }`

    }

    // send our request to the url of the test server
    const response = await request("http://localhost:4000").post('/').send(queryData);

    expect(response.body.errors).toBeUndefined()
    // since only brian's data would be in the users data, it should be less than 2.
    expect(response.body.data?.users.length).toBeLessThan(2);
})

it("fail to return a user", async () => {
    const testServer = new ApolloServer({
        schema: addMocksToSchema({
            schema: makeExecutableSchema({ typeDefs, resolvers })
        })
    })

    const queryData = {
        query: `query user(bank_code: $bankCode, account_number: $accountNumber) {
            user(bank_code: $bankCode, account_number: $accountNumber) {
                user_account_name
                user_account_number
                user_bank_code
              }
          }`,
        variables: {
            bankCode: "044",
            accountNumber: "0690000032"
        }
    }

    // send our request to the url of the test server
    const response = await request("http://localhost:4000").post('/').send(queryData);

    expect(response.body.errors).toBeDefined()
})


it("create new user", async () => {
    const testServer = new ApolloServer({
        schema: addMocksToSchema({
            schema: makeExecutableSchema({ typeDefs, resolvers })
        })
    })

    const queryData = {
        query: `mutation exampleMutation($userAccountNumber: String!, $userBankCode: String!, $userAccountName: String!) {
            createUser(user_account_number: $userAccountNumber, user_bank_code: $userBankCode, user_account_name: $userAccountName) {
                user_account_name
                user_account_number
                user_bank_code
                id
              }
        }`,
        variables: {
            userAccountNumber: "0690000032",
            userBankCode: "044",
            userAccountName: "SHERIFAT BOLANLE IYANDA",
        }
    }

    // send our request to the url of the test server
    const response = await request("http://localhost:4000").post('/').send(queryData);

    expect(response.body.errors).toBeUndefined()
    expect(response.body.data?.createUser.user_account_name).toBe("SHERIFAT BOLANLE IYANDA");
})

it("Should fail to create user with LV greater than 2", async () => {
    const testServer = new ApolloServer({
        schema: addMocksToSchema({
            schema: makeExecutableSchema({ typeDefs, resolvers })
        })
    })

    const queryData = {
        query: `mutation exampleMutation($userAccountNumber: String!, $userBankCode: String!, $userAccountName: String!) {
            createUser(user_account_number: $userAccountNumber, user_bank_code: $userBankCode, user_account_name: $userAccountName) {
                user_account_name
                user_account_number
                user_bank_code
                id
              }
        }`,
        variables: {
            userAccountNumber: "0690000032",
            userBankCode: "044",
            userAccountName: "SHERI LANLE IYANDA",
        }
    }

    // send our request to the url of the test server
    const response = await request("http://localhost:4000").post('/').send(queryData);
    const data: User = {
        id: 4,
        user_account_number: "0690000032",
        user_bank_code: "044",
        user_account_name: "SHERI LANLE IYANDA",
    }


    expect(response.body.errors).toBeDefined()
    expect(response.body.errors[0].message).toBe("Incorrect Data!")

    // resolveAccount returns true if LVD is less than 2 and false if otherwise 
    expect(await resolveAccount(data)).toBe(false);
})