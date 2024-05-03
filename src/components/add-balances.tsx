import {FormEvent, useEffect, useState} from "react";
import {AccountDto, addBalances, getAccounts} from "../service";
import {useMsal} from "@azure/msal-react";
import Box from "@mui/material/Box";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, {Dayjs} from "dayjs";
import {Button, CircularProgress, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useTheme} from '@mui/material/styles';


interface BalanceInfo {
    [index: string]: string | undefined;
}

const AddBalances = () => {
    const theme = useTheme();
    const {instance} = useMsal();
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [accounts, setAccounts] = useState<AccountDto[]>([]);
    const [balances, setBalances] = useState<BalanceInfo>({});
    const [sent, setSent] = useState<{
        [index: string]: string;
    }>({});
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
    const renderAccounts = () => accounts
        .filter(a => a.CloseDate == null)
        .map(a => {
            return (
                <Box key={a.Id} sx={{
                    p: theme.spacing(1)
                }}>
                    {
                        <TextField
                            label={a.Name}
                            inputProps={{inputMode: 'numeric'}}
                            value={balances[a.Id] ?? ''}
                            onChange={(event) => setBalances({
                                ...balances,
                                [a.Id]: event.target.value
                            })}/>
                    }
                    {sent[a.Id] ?? ''}
                </Box>
            );
        });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSent({});
        const controller = new AbortController();
        Object.entries(balances).forEach(([key, value]) => {
            const amountInChf = Number(value);
            if (!Number.isNaN(amountInChf)) {
                addBalances(controller.signal, instance, key, {
                    CheckDate: date!.toISOString(), // TODO JJ Make validation of form?
                    AmountInChf: amountInChf
                }).then(() => {
                    setSent(s => ({...s, [key]: 'Sent'}));
                }).catch(() => {
                    setSent(s => ({...s, [key]: 'Error from backend'}));
                });
            } else {
                setSent(s => ({...s, [key]: 'Not a value skipped'}));
            }
        });
    }

    const renderCurrentTotal = () => Object.entries(balances)
        .map(([_, value]) => Number(value))
        .filter(value => !Number.isNaN(value))
        .reduce((sum, current) => sum + current, 0);

    const renderBalances = () => <form onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label="New Balance at"
                value={date}
                onChange={(newValue) => setDate(newValue)}
            />
        </LocalizationProvider>
        <Box sx={{
            p: theme.spacing(1)
        }}>
            <Typography>
                Please add a balance for concerned account, leave blank to skip.
            </Typography>
            {renderAccounts()}
            <Typography>
                The current total of the balances is : {renderCurrentTotal()}
            </Typography>
        </Box>
        <Button variant="contained" type="submit">Submit</Button>
    </form>;

    const readerInfo = () => {
        if (loading) {
            return (
                <Box>
                    <CircularProgress/>
                </Box>
            );
        }
        return renderBalances();
    }

    return (
        <Box sx={{
            p: theme.spacing(1)
        }}>
            <h1>Add new Balances</h1>
            {readerInfo()}
        </Box>
    );
}

export default AddBalances;