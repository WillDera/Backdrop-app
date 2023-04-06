## Q/A

Question: What's a good reason why  the pure Levenshtein Distance algorithm might be a more effective solution than the broader Damerau–Levenshtein Distance algorithm in this specific scenario.

Answer: Levenshtein Distance is used in a scenario where minimal number of insertions, deletions and symbol substitution are required to transfrom string a to string b which makes it a better option to Damerau–Levenshtein Distance which does same thing as the former but includes transpositions which are not a likely occurance in character omission in this scenario.

## Assumptions

1. When adding data to the in-memory array, I am assuming that the validation should be to determine if the user's data would be added to the array based on a levenshtein distance of < 2 and throw an error if not. Indicated here:

    ```ts
    line 21 (resolvers.ts): 
        if (lv_distance < 2) return true
    ```

    and here:

    ```ts
    line 35 (data.ts):  
        if (await resolveAccount(newUser)) {
                users.push(newUser)

                // Return the new user
                return newUser
            } else {
                throw new Error("Incorrect Data!")
            }
    ```

    As such, I am not storing the Paystack account name, which would inturn mean that the `getUser` endpoint would always return data which includes the user's inputed account name. This assumption is made as I see no reason to have the LV Distance of < 2 as a base of validation before storing a user's data and then making a separate call in a situation where the account_name is not available (which wont be possible as account details would only be stored if the validation is passed).

    NB: I would accept corrections if a counter explanation is provided.
