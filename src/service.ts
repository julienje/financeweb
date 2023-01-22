import {IPublicClientApplication} from "@azure/msal-browser";

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

async function getAuthorizedHeaders(instance: IPublicClientApplication) {
    const {accessToken} = await instance.acquireTokenSilent({
        scopes: ['user.read'],
        account: instance.getAllAccounts()[0]
    });
    return new Headers({
        'Authorization': 'Bearer ' + accessToken
    });
}

export const getWealth = async (signal: AbortSignal, instance: IPublicClientApplication): Promise<WealthDto> => {
    const headers = await getAuthorizedHeaders(instance);
    const request = await fetch(process.env.REACT_APP_BACKEND_URL + '/wealth', {signal, headers});
    const json = await request.json();
    return json as WealthDto;
};

export const getAccounts = async (signal: AbortSignal, instance: IPublicClientApplication): Promise<AccountDto[]> => {
    const headers = await getAuthorizedHeaders(instance);
    const request = await fetch(process.env.REACT_APP_BACKEND_URL + '/accounts', {signal, headers});
    const json = await request.json();
    return json as AccountDto[];
};

export const addBalances = async (signal: AbortSignal, instance: IPublicClientApplication, accountId: string, balance: AddBalanceDto): Promise<AccountBalanceDto> => {
    const headers = await getAuthorizedHeaders(instance);
    headers.append('Content-Type', 'application/json');
    const requestOptions = {
        method: 'PUT',
        headers,
        body: JSON.stringify(balance),
        signal
    };
    const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/accounts/${accountId}/balances/new`, requestOptions);
    const json = await request.json();
    return json as AccountBalanceDto;
};