export enum FinancialTransactionState
{
    FINANCIAL_TRANSACTION_PENDING="financial_transaction_pending",
    FINANCIAL_TRANSACTION_ERROR="financial_transaction_error",
    FINANCIAL_TRANSACTION_SUCCESS="financial_transaction_success",
    FINANCIAL_TRANSACTION_START="financial_transaction_start",
    FINANCIAL_TRANSACTION_PAUSE="financial_transaction_pause",
}

export enum FinancialTransactionType
{
    DEPOSIT="deposit",
    WITHDRAW="withdraw"
}

export enum FinancialTransactionErrorType
{
    BUYER_NOT_FOUND_ERROR=-201,
    RECEIVER_NOT_FOUND_ERROR=-202,
    NO_ERROR=0,
    UNKNOW_ERROR=-200,
    INSUFFICIENT_AMOUNT_ERROR=-204,
    PAIMENT_METHOD_NOT_FOUND=-205,
    INVALID_AMOUNT_ERROR=-206
}

export enum PaymentStrategyType
{
    BANK="bank",
    ORANGE_MONEY="ORANGE",
    MTN_MONEY="MTN",
    CREDIT_CARD="credit_card"
}

export enum PaymentMoneyCode
{
    XAF="XAF",
    FCFA="XAF",
    EUR="EUR",
    $="$"
}