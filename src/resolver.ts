/* eslint-disable no-console */
/* eslint-disable import/extensions */
import axios from 'axios'
import 'dotenv/config'
import { PaystackResult, User } from './interface'
import { distance } from 'fastest-levenshtein'

export const resolveAccount = async (user: User): Promise<boolean> => {
  const paystack_result = await axios.get(
    `https://api.paystack.co/bank/resolve?account_number=${user.user_account_number}&bank_code=${user.user_bank_code}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
      },
    },
  )
  try {
    const data: PaystackResult = paystack_result.data.data
    const account_name = user.user_account_name
    const lv_distance = distance(data.account_name, account_name)

    if (lv_distance < 2) return true
  } catch (error: any) {
    throw new Error(error)
  }

  return false
}
