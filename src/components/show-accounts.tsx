import React, {useEffect, useState} from "react";
import {AccountDto, getAccounts} from "../service";
import {useMsal} from "@azure/msal-react";

const ShowAccounts = () => {
    const { instance } = useMsal();
    const [accounts, setAccounts] = useState<AccountDto[]>([]);
    useEffect(() => {
        const controller = new AbortController();
        const result = async () => {
            const data = await getAccounts(controller.signal, instance);
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