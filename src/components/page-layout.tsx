import {Outlet} from "react-router";
import React from "react";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

const PageLayout = () => {
    return (
        <Box>
            <Box sx={{
                typography: 'body1',
                ml: 2
            }}>
                <Link href={`wealth`}>Wealth</Link>
                <Link href={`balances`}>Balance</Link>
                <Link href={`accounts`}>Accounts</Link>
            </Box>
            <Box>
                <Outlet/>
            </Box>
        </Box>
    );
};

export default PageLayout;
