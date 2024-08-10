import React, { useEffect, useState, } from 'react';
import { CryptoState } from '../CryptoContext';

import { Container, createTheme, TextField, ThemeProvider, Typography, TableContainer, LinearProgress, TableHead, TableRow, TableCell, TableBody, makeStyles } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Table } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

const useStyles = makeStyles(() => ({
    row: {
        backgroundColor: "#16171a",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#131111",
        },
        fontFamily: "Montserrat",
    },
    cell: {
        display: "flex",
        alignItems: "center",
        gap: 15,
    },
    coinImage: {
        height: 50,
        marginBottom: 10,
    },
    coinSymbol: {
        textTransform: "uppercase",
        fontSize: 22,
    },
    coinName: {
        color: "darkgrey",
    },
    pagination: {
        "& .MuiPaginationItem-root": {
            color: "gold",
        },
    },
}));

const CoinsTable = () => {
    
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const navigate = useNavigate();
    const { currency, coins, loading, fetchCoins  } = CryptoState();
    const classes = useStyles();

    useEffect(() => {
        fetchCoins();
    }, [fetchCoins]);

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        },
    });

    const handleSearch = () => {
        return coins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(search.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(search.toLowerCase())
        );
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Container style={{ textAlign: "center" }}>
                <Typography variant="h4" style={{ margin: 18, fontFamily: "Montserrat" }}>
                    Cryptocurrency Prices by Market Cap
                </Typography>
                <TextField
                    label="Search coin ..."
                    variant="outlined"
                    style={{ marginBottom: 20, width: "100%" }}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <TableContainer>
                    {loading ? (
                        <LinearProgress style={{ backgroundColor: "gold" }} />
                    ) : (
                        <Table>
                            <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                                <TableRow>
                                    {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                                        <TableCell
                                            style={{
                                                color: "black",
                                                fontWeight: "700",
                                                fontFamily: "Montserrat",
                                            }}
                                            key={head}
                                            align={head === "Coin" ? "left" : "right"}
                                        >
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {handleSearch().slice((page - 1) * 10, (page - 1) * 10 + 10).map((row) => {
                                    const profit = row.price_change_percentage_24h && row.price_change_percentage_24h > 0;
                                    return (
                                        <TableRow
                                            onClick={() => navigate(`/coin/${row.id}`)}
                                            className={classes.row}
                                            key={row.name}
                                        >
                                            <TableCell component="th" scope="row" className={classes.cell}>
                                                <img src={row?.image} alt={row.name} className={classes.coinImage} />
                                                <div>
                                                    <span className={classes.coinSymbol}>{row.symbol}</span>
                                                    <span className={classes.coinName}>{row.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: currency,
                                                }).format(row.current_price)}
                                            </TableCell>
                                            <TableCell align="right" style={{ color: profit ? "green" : "red" }}>
                                                {row.price_change_percentage_24h !== undefined && row.price_change_percentage_24h !== null
                                                    ? row.price_change_percentage_24h.toFixed(2)
                                                    : "N/A"}%
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.market_cap !== null
                                                    ? new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: currency,
                                                    }).format(row.market_cap).slice(0, -3) + 'M'
                                                    : "N/A"}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
                <Pagination
                    style={{
                        padding: 20,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    classes={{ ul: classes.pagination }}
                    count={Math.ceil(handleSearch().length / 10)}
                    onChange={(_, value) => {
                        setPage(value);
                        window.scrollTo(0, 450);
                    }}
                />
            </Container>
        </ThemeProvider>
    );
};

export default CoinsTable;
