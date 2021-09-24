import React, { useEffect, useState } from 'react';

// material-ui
import { Chip, Grid } from '@material-ui/core';

// project imports
import { gridSpacing } from 'store/constant';
import SearchSection from 'layout/MainLayout/Header/SearchSection';
import MainCard from 'ui-component/cards/MainCard';
import { makeStyles } from '@material-ui/styles';
import Avatar from 'ui-component/extended/Avatar';
import TronGrid from 'trongrid';
import TronWeb from 'tronweb';
import moment from 'moment';
import { LoadingButton } from '@material-ui/lab';

// style constant
const useStyles = makeStyles((theme) => ({
    card: {
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        textAlign: 'center'
    },
    content: {
        padding: '20px !important'
    },
    avatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.largeAvatar,
        backgroundColor: theme.palette.secondary[800],
        marginTop: '8px'
    },
    avatarRight: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary[200],
        zIndex: 1
    },
    cardHeading: {
        fontSize: '2.125rem',
        fontWeight: 500,
        marginRight: '8px',
        marginTop: '14px',
        marginBottom: '6px'
    },
    subHeading: {
        fontSize: '1rem',
        fontWeight: 500,
        color: theme.palette.secondary[200]
    },
    avatarCircle: {
        cursor: 'pointer',
        ...theme.typography.smallAvatar,
        backgroundColor: theme.palette.secondary[200],
        color: theme.palette.secondary.dark
    },
    circleIcon: {
        transform: 'rotate3d(1, 1, 1, 45deg)'
    },
    menuItem: {
        marginRight: '14px',
        fontSize: '1.25rem'
    }
}));

const tronWeb = new TronWeb({
    fullHost: 'http://34.194.89.253:9090',
    privateKey: `9ad4f52a33a632de62c6cde0b6f33cdfd72099457c6fcb1bf4968056e968a3f6`
});

const tronGrid = new TronGrid(tronWeb);

console.log(tronWeb);
console.log(tronGrid);

const address = 'TB867arfyYtqoSLv9hUEDFgfehv4uvpU5k';

// ===========================|| DEFAULT DASHBOARD ||=========================== //

const Dashboard = () => {
    const classes = useStyles();
    const [isLoading, setLoading] = useState(true);
    const [isAddress, setIsAddress] = useState(false);
    const [isTransaction, setIsTransaction] = useState(false);
    const [isBlock, setIsBlock] = useState(false);
    const [count, setCount] = React.useState(0);
    const [account, setAccount] = React.useState({});
    const [transaction, setTransaction] = React.useState({
        tx: {
            txID: ''
        },
        info: {
            ret: []
        }
    });
    const [block, setBlock] = React.useState({
        blockID: '',
        block_header: {
            raw_data: {
                number: 0
            }
        },
        transactions: []
    });

    const getTransaction = async (tx) => {
        console.log('tx');
        console.log(tx);
        setLoading(true);
        try {
            const transactionInfo = {};
            transactionInfo.tx = await tronWeb.trx.getTransaction(tx);
            transactionInfo.info = await tronWeb.trx.getTransactionInfo(tx);
            setTransaction(transactionInfo);
            console.log('setIsTransaction');
            console.warn(transactionInfo);
            setIsTransaction(true);
            setIsAddress(false);
            setIsBlock(false);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const getAccount = async (addr) => {
        const accountData = await tronWeb.trx.getAccount(addr);
        const accountResources = await tronWeb.trx.getAccountResources(addr);
        console.log(accountData);
        console.log(accountResources);
        const accountJSONData = {};
        accountJSONData.accountData = accountData;
        accountJSONData.accountResources = accountResources;
        console.log('accountJSONData');
        console.log(accountJSONData);
        setAccount(accountJSONData);
        setIsTransaction(false);
        setIsAddress(true);
        setIsBlock(false);
        setLoading(false);
    };

    const sendTrx = () => {
        tronWeb.trx
            .sendTrx('TF1KcmetvbznYDZu8A3EfxNFAdvJg6oaZU', 1000)
            .then((result) => {
                console.log('sendTrx');
                console.warn(result);
                // getTransaction(result.transaction.txID);
                // getTransaction('b9120777763f8fe80e7f38097e208d8aa7ae9b33e64ef87e9fd4af238ff2c667');
            })
            .catch((result) => console.warn(result));
    };

    const getBlockTransactionCount = (tx) => {
        console.log(tx);
        tronWeb.trx.getBlockTransactionCount(tx.block_header.raw_data.number).then((result) => {
            console.log('setCount');
            console.log(result);
            setCount(result);
        });
    };

    const fetchBlock = () => {
        console.log(block);
        setLoading(true);

        // getAccount();
        // getTransaction('b9120777763f8fe80e7f38097e208d8aa7ae9b33e64ef87e9fd4af238ff2c667');
        // tronWeb.trx.getBlock(block.block_header.raw_data.number).then((result) => {
        tronWeb.trx
            .getBlock(block.block_header.raw_data.number)
            // .getBlock(8197)
            .then((result) => {
                console.log('getBlock');
                console.log(result);
                setIsTransaction(false);
                setIsAddress(false);
                setIsBlock(true);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
        tronWeb.trx
            .getTransactionFromBlock(block.block_header.raw_data.number)
            .then((result) => {
                console.log('getTransactionFromBlock');
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const timeDifference = (date) => {
        const now = moment(new Date());
        const end = moment(date);
        const duration = moment.duration(now.diff(end));
        return duration.humanize();
    };

    const isNumeric = (str) => {
        if (typeof str !== 'string') return false;
        return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
    };

    const onSearch = (data) => {
        console.log(data);
        console.log(typeof data);
        if (tronWeb.isAddress(data)) {
            setLoading(true);
            getAccount(data);
        } else if (isNumeric(data)) {
            setLoading(true);
            tronWeb.trx
                .getBlock(data)
                .then((result) => {
                    console.log('getBlock');
                    console.log(result);
                    setIsTransaction(false);
                    setIsAddress(false);
                    setIsBlock(true);
                    setLoading(false);
                    setBlock(result);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
            tronWeb.trx
                .getTransactionFromBlock(data)
                .then((result) => {
                    console.log('getTransactionFromBlock');
                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            getTransaction(data);
        }
    };

    useEffect(() => {
        setLoading(false);
        tronWeb.trx
            .getCurrentBlock()
            // .getBlock(8197)
            .then((result) => {
                console.log('setBlock');
                console.log(result);
                console.warn(result.blockID);
                setBlock(result);
                console.log(block);
                getBlockTransactionCount(block);
            })
            .catch((err) => {
                console.log(err);
            });
        console.log(isLoading);
        console.log(tronWeb.isAddress(address));
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <MainCard className={classes.card} contentClass={classes.content}>
                            <h1 style={{ color: 'black' }}>IdeaChain Block Explorer</h1>
                            <SearchSection onChange={onSearch} theme="light" />
                            <span style={{ color: 'gray', margin: 10 }}>LATEST BLOCK</span>
                            <Chip
                                style={{ color: 'gray', margin: 10 }}
                                avatar={<Avatar>#</Avatar>}
                                label={block.block_header.raw_data.number}
                                component="a"
                                href={`/#/block/${block.block_header.raw_data.number}`}
                                onClick={fetchBlock}
                                variant="filled"
                                clickable
                            />
                            <span style={{ color: 'gray', margin: 10 }}>TRANSACTIONS</span>
                            <Chip style={{ color: 'gray', margin: 10 }} label={count} component="a" href="#basic-chip" variant="filled" />
                        </MainCard>
                        {isLoading ? (
                            <MainCard style={{ marginTop: 20, textAlign: 'center' }}>
                                <LoadingButton loading loadingIndicator="Loading..." variant="outlined">
                                    Loading..
                                </LoadingButton>
                            </MainCard>
                        ) : null}
                        {isBlock ? (
                            <MainCard style={{ marginTop: 20 }}>
                                <h4>Block Details</h4>
                                <Grid container spacing={2}>
                                    {
                                        // block.transactions.map((b) => { console.log(b); return null;})
                                    }
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>Block Number</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>{block.block_header.raw_data.number}</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>Block Hash</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>{block.block_header.raw_data.parentHash}</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>Block Time</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>{timeDifference(block.block_header.raw_data.timestamp)} ago</span>
                                    </Grid>
                                </Grid>
                            </MainCard>
                        ) : null}
                        {isTransaction ? (
                            <MainCard style={{ marginTop: 20 }}>
                                <h4>Transaction Details</h4>
                                <Grid container spacing={2}>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>Transaction ID</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>{transaction.tx.txID}</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>Result</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>{transaction.tx.ret[0].contractRet}</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>Block</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>#{transaction.info.blockNumber}</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>Time</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>{timeDifference(transaction.tx.raw_data.timestamp)}</span>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <h5>Transfer TRX</h5>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>From</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>{transaction.tx.raw_data.contract[0].parameter.value.owner_address}</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>To</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>{transaction.tx.raw_data.contract[0].parameter.value.to_address}</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>Amount</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>{transaction.tx.raw_data.contract[0].parameter.value.amount}</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>Consume Bandwidth</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>{transaction.info.receipt.net_usage} Bandwidth</span>
                                    </Grid>
                                </Grid>
                            </MainCard>
                        ) : null}
                        {isAddress ? (
                            <MainCard style={{ marginTop: 20 }}>
                                <h4>Account Details</h4>
                                <Grid container spacing={2}>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>TRX Balance</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>{account.accountData.balance / 1000000}</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>Created</span>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                        <span>{timeDifference(account.accountData.create_time)} ago</span>
                                    </Grid>
                                </Grid>
                            </MainCard>
                        ) : null}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
