import React, {useEffect, useState} from "react";
import {getWealth, WealthDto} from "../service";
import {useMsal} from "@azure/msal-react";

const ShowWealth = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const { instance } = useMsal();
    const [wealth, setWealth] = useState<WealthDto>();
    useEffect(() => {
        if (!!date) {
            const controller = new AbortController();
            const result = async () => {
                const data = await getWealth(controller.signal, instance);
                setWealth(data);
            }
            result().catch(console.error);
            return () => {
                controller.abort();
            }
        }
    }, [date]);


    const renderWealth = () => {
        const emptyDetails = (<div>There is no details</div>);
        const details = wealth?.Details.length === 0 ? emptyDetails : wealth?.Details.map(d =>
            (
                <div key={d.AccountId}>
                    <div>{d.AccountName} - {d.AccountCompany}</div>
                    <div>{d.AmountInChf}</div>
                    <div>{d.CheckDate}</div>
                </div>
            ));
        return (
            <div>
                <div>My wealth for {wealth?.ExportDate} is {wealth?.AmountInChf} CHF.</div>
                <div>{details}</div>
            </div>
        );
    };

    return (
        <div>
            <form>
                <label>Date:</label>
                <input type="date" name="date" value={date} onChange={(event) => setDate(event.target.value)}/>
            </form>
            <div>
                {renderWealth()}
            </div>
        </div>
    );
};

export default ShowWealth;