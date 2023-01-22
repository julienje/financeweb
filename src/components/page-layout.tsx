import {Outlet} from "react-router";
import React from "react";

const PageLayout = () => {
    return (
        <div>
            <div>
                <div>
                    <a href={`wealth`}>Wealth</a>
                </div>
                <div>
                    <a href={`balances`}>Balance</a>
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

export default PageLayout;
