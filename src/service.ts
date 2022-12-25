export interface WealthDto {
    AmountInChf: number,
    ExportDate: string
    Details: WealthAccountDto[]
}

export interface WealthAccountDto {
    AmountInChf: number
    AccountId: string
    AccountName: string
    AccountCompany: string
    CheckDate: string
}

export interface AccountDto {
    Id: string,
    Name: string,
    Company: string,
    OpenDate: string,
    CloseDate: string
}

export interface AddBalanceDto {
    CheckDate: string
    AmountInChf: number
}

export interface AccountBalanceDto {
    Id: string
    AccountId: string
    CheckDate: string
    AmountInChf: number
}

export interface NewBalance {
    [index: string]: string | undefined;
}

export const getWealth = async (signal: AbortSignal): Promise<WealthDto> => {
    const request = await fetch(process.env.REACT_APP_BACKEND_URL + '/wealth', {signal});
    const json = await request.json();
    return json as WealthDto;
};

export const getAccounts = async (signal: AbortSignal): Promise<AccountDto[]> => {
    const request = await fetch(process.env.REACT_APP_BACKEND_URL + '/accounts', {signal});
    const json = await request.json();
    return json as AccountDto[];
};

export const addBalances = async (signal: AbortSignal, balances: AddBalanceDto[]): Promise<AccountBalanceDto[]> => {


    const request = await fetch(process.env.REACT_APP_BACKEND_URL + '/accounts/%s/balances/new', {signal});
    const json = await request.json();
    return json as AccountBalanceDto[];
};