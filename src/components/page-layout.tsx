import {Outlet} from "react-router";
import React from "react";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const PageLayout = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>

            <Box>
                <Box sx={{
                    display: 'flex',
                    backgroundColor: 'primary',
                    '& > a': {
                        padding: darkTheme.spacing(1)
                    },

                }}>
                    <Link href={`wealth`}>Wealth</Link>
                    <Link href={`balances`}>Balance</Link>
                    <Link href={`accounts`}>Accounts</Link>
                </Box>
                <Box sx={{
                    m: darkTheme.spacing(1)
                }}>
                    <Outlet/>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default PageLayout;
