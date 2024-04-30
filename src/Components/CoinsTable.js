import React, { useEffect, useState } from 'react'
import { CoinList } from '../config/api';
import { CryptoState } from '../CryptoContext';
import axios from 'axios';
import { Container, createTheme, TextField, ThemeProvider, Typography, TableContainer, LinearProgress, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import { Table } from '@material-ui/core';

const CoinsTable = () => {
    const [coins, setcoins] = useState([]);
    const [loading, setloading] = useState(false);
    const [search, setserach] = useState("")
    const navigate = useNavigate();

    const { currency } = CryptoState();

    const fetchCoins = () => async () => {
        setloading(true);
        const { data }  = await axios.get(CoinList(currency));

        setcoins(data);
        setloading(false);
    };

    console.log(coins);
    
    useEffect(() => {
        fetchCoins();
    }, [currency]);

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
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
        );
        };

        const useStyles = makeStyles(() => ({}));
        const classes = useStyles();
  
    return ( <ThemeProvider theme={darkTheme}>
        <Container style= {{ textAlign: "center" }}>
           <Typography
                variant="h4"
                style={{ margin: 18, fontFamily: "Montserrat"}} 
            >
            Cryptocurrency Prices by Market Cap
                </Typography>

                <TextField 
                    label="Search coin ..." 
                    variant= "outlined" 
                    style = {{ marginBottom: 20, width: "100%" }}
                    onChange={(e) => setserach(e.target.value)}
                    />

                    <TableContainer>
                       {
                        loading? (
                            <LinearProgress style={{ backgroundColor: "gold"}} />
                        ) : (
                            <Table>
                                <TableHead style={{ backgroundColor: "#EEBC1D"}}>
                                <TableRow>
                                    {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                                        <TableCell
                                         style={{
                                            color: "black",
                                            fontWeight: "700",
                                            fontFamily: "Montserrat",
                                         }}
                                         key={head}
                                         align={head === "Coin" ? "" : "right"}
                                        >
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                </TableHead>
                                <TableBody> 
                                 {handleSearch().map((row) => {
                                    const profit = row.price_change_percentage_24h > 0;

                                    return (
                                        <TableRow
                                            onClick={() => navigate(`/coin/${row.id}`)}
                                            className={classes.row}
                                            key={row.name}
                                        >
                                            <TableCell 
                                            component="th" 
                                            scope="row"
                                            styles={{
                                                display: "flex",
                                                gap: 15,
                                            }} 
                                         >
                                           <img
                                            src={row?.image}
                                            alt={row.name}
                                            height="50"
                                            style= {{ marginBottom: 10}}

                                        />
                                         </TableCell>
                                        </TableRow>
                                    );

                                 })}
                                </TableBody>
                            </Table>
                        )}

                    </TableContainer>
                
        </Container>
    
    </ThemeProvider>
    );
  
};

export default CoinsTable