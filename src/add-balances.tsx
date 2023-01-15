import React, {FormEvent, useEffect, useState} from "react";
import {AccountDto, addBalances, getAccounts} from "./service";

interface BalanceInfo {
    [index: string]: string | undefined;
}

const AddBalances = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [accounts, setAccounts] = useState<AccountDto[]>([]);
    const [balances, setBalances] = useState<BalanceInfo>({});
    const [sent, setSent] = useState<{
        [index: string]: string;
    }>({});
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
                </label>
                <input type="string" name="balance" value={balances[a.Id] ?? ''} onChange={(event) => {
                    const newBalance = {...balances, [a.Id]: event.target.value}
                    setBalances(newBalance)
                }}/>
                {sent[a.Id] ?? ''}
            </div>
        );
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`Form submitted, ${JSON.stringify(balances)}`);
        const controller = new AbortController();
        Object.entries(balances).forEach(([key, value]) => {
            let amountInChf = Number(value);
            if (!Number.isNaN(amountInChf)) {
                addBalances(controller.signal, key, {
                    CheckDate: date,
                    AmountInChf: amountInChf
                }).then(() => {
                    setSent(s => ({...s, [key]: 'Sent'}));
                })
                    .catch(() => {
                        setSent(s => ({...s, [key]: 'Error from backend'}));
                    });
            } else {
                setSent(s => ({...s, [key]: 'Not a value skipped'}));
            }
        });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Date:
                    <input type="date" name="date" value={date} onChange={(event) => setDate(event.target.value)}/>
                </label>
                {renderAccounts()}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AddBalances;