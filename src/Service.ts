export interface WealthDTO{
    AmountInChf : number,
    ExportDate: string
}
export const getWealth = async (signal: AbortSignal): Promise<WealthDTO> => {
    const request = await fetch(process.env.REACT_APP_BACKEND_URL + '/wealth');
    const json = await request.json();
    return json as WealthDTO;
};
