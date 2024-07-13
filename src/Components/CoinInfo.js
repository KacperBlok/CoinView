import React, { useEffect, useState} from 'react'
import  { CryptoState } from '../CryptoContext';
import { HistoricalChart } from '../config/api';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import axios from "axios";


const CoinInfo = ({coin}) => {
  const [HistoricalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);

  const { currency } = CryptoState();

  const fetchHistoricalData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setHistoricalData(data.prices);
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [currency, days]);

    const darkTheme = createTheme({
        palette: {
          primary: {
            main: "#fff",
        },
        type: "dark",
      }, 
    });

    const useStyles=makeStyles(() => ({

    }))

    const classes = useStyles();
        
    return (
      <ThemeProvider theme={darkTheme}>
        <div className={classes.container}></div>
        /</ThemeProvider>

    )
  
};

export default CoinInfo