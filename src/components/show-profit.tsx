import {useEffect, useState} from "react";
import {getProfit, ProfitDto} from "../service";
import {useMsal} from "@azure/msal-react";
import Box from "@mui/material/Box";
import {AccordionDetails, CircularProgress} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useTheme} from '@mui/material/styles';
import dayjs from "dayjs";
import {dateTimeTemplate} from "../constants.ts";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";

const ShowProfit = () => {
    const theme = useTheme();
    const [profit, setProfit] = useState<ProfitDto | null>(null);
    const [loading, setLoading] = useState(false);
    const {instance} = useMsal();
    useEffect(() => {
        const controller = new AbortController();
        const result = async () => {
            setLoading(true);
            const data = await getProfit(controller.signal, instance);
            setProfit(data);
            setLoading(false);
        }
        result().catch(console.error);
        return () => {
            controller.abort();
        }
    }, [instance]);


    const renderInfo = () => {
        if (!profit) {
            return (
                <Box>
                    <Box sx={{
                        p: theme.spacing(1)
                    }}>
                        <Typography>There is no details</Typography>
                    </Box>
                </Box>
            )
        }

        const profitDate = dayjs(profit.ProfitDate).format(dateTimeTemplate);
        const companies = profit.Details.map(d => {
            const balanceDetails = d.Details.map(bd => {
                const accountCheckDate = dayjs(bd.CheckDate).format(dateTimeTemplate);
                return (
                    <Typography key={bd.AccountId}>
                        On {accountCheckDate} the account {bd.AccountName} has {bd.AmountInChf} CHF
                    </Typography>
                );
            });
            return (
                <Accordion key={d.Company}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>On {d.Company} the profit is {d.Profit.WealthInChf} CHF
                            for {d.Profit.InvestmentInChf} CHF invested
                            ({d.Profit.WealthInChf - d.Profit.InvestmentInChf} CHF).</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                        {balanceDetails}
                    </AccordionDetails>
                </Accordion>
            );
        });
        return (
            <Box>
                <Typography>
                    At {profitDate} the profit is {profit.Profit.WealthInChf} CHF
                    for {profit.Profit.InvestmentInChf} CHF invested
                    ({profit.Profit.WealthInChf - profit.Profit.InvestmentInChf} CHF).
                </Typography>
                {companies}
            </Box>
        )
    }

    const renderLoading = () => {
        if (loading) {
            return (
                <Box>
                    <CircularProgress/>
                </Box>
            );
        }
        return renderInfo();
    }

    return (
        <Box sx={{
            p: theme.spacing(1)
        }}>
            <h1>Profit</h1>
            {renderLoading()}
        </Box>
    );

}

export default ShowProfit;