import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./components/error-page";
import ShowWealth from "./components/show-wealth";
import ShowAccounts from "./components/show-accounts";
import AddBalances from "./components/add-balances";
import {MsalProvider} from "@azure/msal-react";
import {msalConfig} from "./authConfig";
import {PublicClientApplication} from "@azure/msal-browser";

const msalInstance = new PublicClientApplication(msalConfig);


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "wealth",
                element: <ShowWealth/>
            },
            {
                path: "accounts",
                element: <ShowAccounts/>,
            },
            {
                path: "balances",
                element: <AddBalances/>
            }
        ],
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <RouterProvider router={router}/>
        </MsalProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
