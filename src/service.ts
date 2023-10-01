import {IPublicClientApplication} from "@azure/msal-browser";
import {Dayjs} from "dayjs";

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

export interface OpenAccountDto {
    Name: string
    Company: string
    OpenDate: string
}

export interface ErrorDto {
    error: string
}

async function getAuthorizedHeaders(instance: IPublicClientApplication) {
    const {accessToken} = await instance.acquireTokenSilent({
        scopes: ['api://1cfe66e3-db51-4082-93ad-0814bff72abf/default'],
        account: instance.getAllAccounts()[0]
    });
    return new Headers({
        'Authorization': 'Bearer ' + accessToken
    });
}

export const getWealth = async (signal: AbortSignal, instance: IPublicClientApplication, date: Dayjs): Promise<WealthDto> => {
    const headers = await getAuthorizedHeaders(instance);
    const params = new URLSearchParams();
    params.set('date', date.toISOString());

    const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/wealth?${params}`, {signal, headers});
    const json = await request.json();
    return json as WealthDto;
};

export const getAccounts = async (signal: AbortSignal, instance: IPublicClientApplication): Promise<AccountDto[]> => {
    const headers = await getAuthorizedHeaders(instance);
    const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/accounts`, {signal, headers});
    const json = await request.json();
    return json as AccountDto[];
};

export const getBalanceForAccount = async (signal: AbortSignal, instance: IPublicClientApplication, accountId: string): Promise<AccountBalanceDto[]> => {
    const headers = await getAuthorizedHeaders(instance);
    const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/accounts/${accountId}/balances`, {signal, headers});
    const json = await request.json();
    return json as AccountBalanceDto[];
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

export const addAccount = async (signal: AbortSignal, instance: IPublicClientApplication, newAccount: OpenAccountDto): Promise<AccountDto> => {
    const headers = await getAuthorizedHeaders(instance);
    headers.append('Content-Type', 'application/json');
    const requestOptions = {
        method: 'PUT',
        headers,
        body: JSON.stringify(newAccount),
        signal
    };
    const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/accounts/new`, requestOptions);
    const json = await request.json();
    if (request.ok) {
        return json as AccountDto;
    }
    const error = json as ErrorDto;
    throw new Error(error.error);
};