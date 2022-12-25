import React, {useEffect, useState} from "react";
import {AccountDto, getAccounts} from "./service";

const ShowAccounts = () => {
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
                <div>
                    {a.Name}
                </div>
                <div>{a.Company}</div>
                <div>{a.OpenDate}</div>
                <div>{a.CloseDate}</div>
            </div>
        );
    });


    return (
        <div>
            <div>Show your accounts:</div>
            {renderAccounts()}
        </div>
    );
};

export default ShowAccounts;