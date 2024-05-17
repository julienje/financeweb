import {useEffect, useState} from "react";
import {getProfit, ProfitDto} from "../service";
import {useMsal} from "@azure/msal-react";
import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useTheme} from '@mui/material/styles';
import dayjs from "dayjs";
import {dateTimeTemplate} from "../constants.ts";

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
        const gain = profit.Profit.WealthInChf - profit.Profit.InvestmentInChf;
        return (
            <Box>
                <Typography>
                    The profit on {profitDate} is {profit.Profit.WealthInChf} CHF
                    for {profit.Profit.InvestmentInChf} CHF invested ({gain} CHF).
                </Typography>
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