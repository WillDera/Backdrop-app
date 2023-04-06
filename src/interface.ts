export type User = {
  id: number
  user_account_number: string
  user_bank_code: string
  user_account_name: string
}

export type PaystackResult = {
  account_number: string
  account_name: string
  bank_id: number
}
