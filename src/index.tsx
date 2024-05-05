import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./components/error-page";
import ShowWealth from "./components/show-wealth";
import ShowAccounts from "./components/show-accounts";
import AddBalances from "./components/add-balances";
import {MsalProvider} from "@azure/msal-react";
import {msalConfig} from "./authConfig";
import {PublicClientApplication} from "@azure/msal-browser";
import AddAccount from "./components/add-account";
import ShowTrend from "./components/show-trend";
import AddInvestment from "./components/add-investment.tsx";

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
            }, {
                path: "trend",
                element: <ShowTrend/>
            },
            {
                path: "accounts",
                element: <ShowAccounts/>,
            },
            {
                path: "balances",
                element: <AddBalances/>
            },
            {
                path: "account/new",
                element: <AddAccount/>,
            },
            {
                path: "investment",
                element: <AddInvestment/>,
            }
        ],
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root')!
);
root.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <RouterProvider router={router}/>
        </MsalProvider>
    </React.StrictMode>
);
