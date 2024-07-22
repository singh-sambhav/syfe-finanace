export type TransactionReqBodyType = {
    amount : number,
    category : string,
    description? : string,
    type :  "INCOME" | "EXPENSE"
}

export type UpdateTransactionReqBodyType = {
    amount? : number,
    category? : string,
    description? : string,
    type? :  "INCOME" | "EXPENSE"
}