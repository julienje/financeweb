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
    [index: string]: AddBalanceDto;
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

export const addBalances = async (signal: AbortSignal, accountId: string, balance: AddBalanceDto): Promise<AccountBalanceDto> => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(balance),
        signal: signal
    };
    const request= await fetch(`${process.env.REACT_APP_BACKEND_URL}/accounts/${accountId}/balances/new`, requestOptions);
    const json = await request.json();
    return json as AccountBalanceDto;

    // const calls = Object.entries(balances).map(value => {
    //     const key = value[0];
    //     const balance = value[1];
    //     const requestOptions = {
    //         method: 'PUT',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(balance),
    //         signal: signal
    //     };
    //     return fetch(`${process.env.REACT_APP_BACKEND_URL}/accounts/${key}/balances/new`, requestOptions);
    // });
    // console.log(calls.length);
    // return [];
};