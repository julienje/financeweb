import React, {useEffect, useState} from "react";
import {getWealth, WealthDto} from "./service";

const Wealth = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [wealth, setWealth] = useState<WealthDto>();
    useEffect(() => {
        if (!!date) {
            const controller = new AbortController();
            const result = async () => {
                const data = await getWealth(controller.signal);
                setWealth(data);
            }
            result();
            return () => {
                controller.abort();
            }
        }
    }, [date]);


    const renderWealth = () => {
        const details = wealth?.Details.map(d=>{
            return (
                <div key={d.AccountId}>
                    <div>{d.AmountInChf}</div>
                    <div>{d.CheckDate}</div>
                </div>
            );
        })
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

export default Wealth;