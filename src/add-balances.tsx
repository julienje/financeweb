import React, {useEffect, useState} from "react";
import {AccountDto, getAccounts} from "./service";

interface NewBalance{
    [index: string]: string | undefined;
}
const AddBalances = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [balances, setBalances] = useState<NewBalance>({});
    const [accounts, setAccounts] = useState<AccountDto[]>([]);
    useEffect(() => {
        const controller = new AbortController();
        const result = async () => {
            const data = await getAccounts(controller.signal);
            setAccounts(data);
        }
        result().catch(console.error);
        return () => {
            controller.abort();
        }
    }, []);
    const renderAccounts = () => accounts.map(a => {
        return (
            <div key={a.Id}>
                <label>
                    {a.Name}
                    <input type="string" name="balance" value={balances[a.Id]??''} onChange={(event) => setBalances({[a.Id]: event.target.value})}/>
                </label>
            </div>
        );
    });
    return (
        <div>
            <form>
                <label>
                    Date:
                    <input type="date" name="date" value={date} onChange={(event) => setDate(event.target.value)}/>
                </label>
                {renderAccounts()}
            </form>
        </div>
    );
}

export default AddBalances;