// CoinPage.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from'react';
import { CryptoState } from '../CryptoContext';
import { SingleCoin } from '../config/api';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import CoinInfo from '../Components/CoinInfo';

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState({});

  const { currency,symbol } = CryptoState();

  const fetchCoin = async() => {
    const {data} = await axios.get(SingleCoin(id));

    setCoin(data);
  };

  console.log(coin);

  useEffect(() => {
    fetchCoin();
  }, []);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down('md')]: {
        flexDirection: "column",  
        alignItems: "center",
      }
    }

  }))
  const classes = useStyles();
  
  return (
  <div className={classes.container}>
    <div className={classes.sidebar}>
      {/* sidebar */}

    </div>
    {/* chart */}
    <CoinInfo coin={coin} />
  </div>
  )
  
};

export default CoinPage;
