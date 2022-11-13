import React, {useState, useEffect} from 'react';
import './App.css';
import {getWealth} from "./Service";

const App = () => {
    const [date, setDate] = useState('');
    useEffect(() => {
        if (!!date) {
            const controller = new AbortController();
            const result = async () => {
                const data= await getWealth(controller.signal);
                console.log(data);
            }
            result();
            return controller.abort;
        }
    }, [date]);
    return (
        <div>
            <form>
                <label>Date:</label>
                <input type="date" name="date" value={date} onChange={(event)=>setDate(event.target.value)}/>
                <input type="submit" value="Submit"/>
            </form>
            {date}
        </div>
    );
};

export default App;
