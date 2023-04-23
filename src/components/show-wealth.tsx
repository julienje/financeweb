import React, {useEffect, useState} from "react";
import {getWealth, WealthDto} from "../service";
import {useMsal} from "@azure/msal-react";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import {AccordionDetails} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ShowWealth = () => {
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const {instance} = useMsal();
    const [wealth, setWealth] = useState<WealthDto>();
    useEffect(() => {
        if (!!date) {
            const controller = new AbortController();
            const result = async () => {
                const data = await getWealth(controller.signal, instance);
                setWealth(data);
            }
            result().catch(console.error);
            return () => {
                controller.abort();
            }
        }
    }, [date, instance]);

    const renderWealth = () => {
        const emptyDetails = (<Typography>There is no details</Typography>);
        const details = wealth?.Details.length === 0 ? emptyDetails : wealth?.Details.map(d =>
            (
                <Accordion key={d.AccountId}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>{d.AccountName} - {d.AmountInChf} CHF</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            The account {d.AccountName} by {d.AccountCompany} had {d.AmountInChf} CHF on {d.CheckDate}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ));
        return (
            <Box>
                <Typography>
                    The wealth at {wealth?.ExportDate} is {wealth?.AmountInChf} CHF.
                </Typography>
                {details}
            </Box>
        );
    };

    return (
        <Box>
            <h1>Get you actual wealth</h1>
            <form>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Wealth at"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                    />
                </LocalizationProvider>
            </form>
            <div>
                {renderWealth()}
            </div>
        </Box>
    );
};

export default ShowWealth;