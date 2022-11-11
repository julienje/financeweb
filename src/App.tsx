import React, {useState, useEffect} from 'react';
import './App.css';

const App = () => {
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND_URL + '/wealth')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setDate(new Date())
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);
    return (
        <div>
            <form>
                <label>Date:</label>
                <input type="date" name="date"/>
                <input type="submit" value="Submit"/>
            </form>
            {date.toDateString()}
        </div>
    );
};

export default App;
