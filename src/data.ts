/* eslint-disable import/extensions */
import { resolveAccount } from './resolver'
import { User } from './interface'

// Sample users
const users = [
  {
    id: 1,
    user_account_name: 'Brian',
    user_account_number: '21',
    user_bank_code: '1000',
  },
]

// Return a single user.
export const getUser = (_: unknown, args: { bank_code: string; account_number: string }) => {
  return users.filter(
    user => user.user_bank_code === args.bank_code && user.user_account_number === args.account_number,
  )[0]
}

// Return all users
export const getUsers = () => {
  return users
}

export const createUser = async (
  _: unknown,
  args: { user_account_number: string; user_bank_code: string; user_account_name: string },
) => {
  // Add user to database
  const newUser: User = {
    id: Number(users.length + 1),
    user_account_number: args.user_account_number,
    user_bank_code: args.user_bank_code,
    user_account_name: args.user_account_name,
  }

  if (await resolveAccount(newUser)) {
    users.push(newUser)

    // Return the new user
    return newUser
  } else {
    throw new Error('Incorrect Data!')
  }
}
