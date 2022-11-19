import React from 'react';
import './App.css';
import {Outlet} from "react-router";


const App = () => {
    return (
        <div>
            <div>
                <div>
                    <a href={`wealth`}>Wealth</a>
                </div>
                <div>
                    <a href={`accounts`}>Accounts</a>
                </div>
            </div>

            <div id="detail">
                <Outlet/>
            </div>
        </div>
    );
};

export default App;
