import React, {FormEvent, useEffect, useState} from "react";
import {AccountDto, getAccounts, NewBalance} from "./service";

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
                    <input type="string" name="balance" value={balances[a.Id]??''} onChange={(event) =>{
                        const newBalance = {...balances, [a.Id]:event.target.value}
                        setBalances(newBalance)
                    }}/>
                </label>
            </div>
        );
    });

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`Form submitted, ${JSON.stringify(balances)}`);
        Object.entries(balances).forEach(([key, value]) => {
            // 👇️ name Tom 0, country Chile 1
            console.log(key, value  );
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