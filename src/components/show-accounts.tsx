import React, {useEffect, useState} from "react";
import {AccountDto, getAccounts} from "../service";
import {useMsal} from "@azure/msal-react";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import {AccordionDetails, CircularProgress} from "@mui/material";
import {useTheme} from "@mui/material/styles";

const ShowAccounts = () => {
    const theme = useTheme();
    const {instance} = useMsal();
    const [accounts, setAccounts] = useState<AccountDto[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const controller = new AbortController();
        const result = async () => {
            setLoading(true);
            const data = await getAccounts(controller.signal, instance);
            setAccounts(data);
            setLoading(false);
        }
        result().catch(console.error);
        return () => {
            controller.abort();
        }
    }, [instance]);

    const getCloseDate = (a: AccountDto) => {
        if (a.CloseDate == null) {
            return '';
        }
        return 'and closed at {a.CloseDate}';
    };

    const renderAccounts = () => accounts.map(a => {
        return (
            <Accordion key={a.Id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>{a.Name} - {a.Company}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        The account was open at {a.OpenDate} {getCloseDate(a)}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        );
    });

    const readerInfo = () => {
        if (loading) {
            return (
                <Box>
                    <CircularProgress/>
                </Box>
            );
        }
        return renderAccounts();
    }


    return (
        <Box sx={{
            p: theme.spacing(1)
        }}>
            <h1>Show your accounts:</h1>
            {readerInfo()}
        </Box>
    );
};

export default ShowAccounts;