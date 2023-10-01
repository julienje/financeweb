import {useTheme} from "@mui/material/styles";
import {useMsal} from "@azure/msal-react";
import React, {useEffect, useState} from "react";
import {AccountBalanceDto, getBalanceForAccount} from "../service";
import {Button, CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

const ShowBalanceAccount = (props: { accountId: string }) => {
    const {instance} = useMsal();
    const [balances, setBalances] = useState<AccountBalanceDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [needLoading, setNeedLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const columns: GridColDef[] = [
        {
            field: 'CheckDate',
            headerName: 'Date'
        },
        {
            field: 'AmountInChf',
            headerName: 'Amount'
        }
    ];


    useEffect(() => {
        if (needLoading) {
            const controller = new AbortController();
            const result = async () => {
                setLoading(true);
                const data = await getBalanceForAccount(controller.signal, instance, props.accountId);
                setBalances(data);
                setLoading(false);
                setLoaded(true);
                setNeedLoading(false);
            }
            result().catch(console.error);
            return () => {
                controller.abort();
            }
        }
    }, [instance, needLoading, props.accountId]);

    const renderBalances = () => {
        if(!loaded){
            return null;
        }
        if(loading){
            return(
                <Box>
                    <CircularProgress/>
                </Box>
            );
        }
        return (
            <Box>
                <DataGrid
                    rows={balances}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={r=> r.Id}
                />
            </Box>
        );
    };

    return (
        <Box>
            <Button onClick={() => {
                setNeedLoading(true);
            }}>{loaded ? 'Refresh' : 'Show'} balances?</Button>
            {renderBalances()}
        </Box>
    );
}
export default ShowBalanceAccount;