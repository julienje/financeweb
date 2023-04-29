import React, {useEffect, useState} from "react";
import {AccountDto, getAccounts} from "../service";
import {useMsal} from "@azure/msal-react";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import {AccordionDetails} from "@mui/material";

const ShowAccounts = () => {
    const { instance } = useMsal();
    const [accounts, setAccounts] = useState<AccountDto[]>([]);
    useEffect(() => {
        const controller = new AbortController();
        const result = async () => {
            const data = await getAccounts(controller.signal, instance);
            setAccounts(data);
        }
        result().catch(console.error);
        return () => {
            controller.abort();
        }
    }, [instance]);

    const getCloseDate = (a: AccountDto) => {
        if(a.CloseDate == null){
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


    return (
        <Box>
            <h1>Show your accounts:</h1>
            {renderAccounts()}
        </Box>
    );
};

export default ShowAccounts;