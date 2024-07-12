import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import { SingleCoin } from '../config/api';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import CoinInfo from '../Components/CoinInfo';
import { Oval } from 'react-loader-spinner';

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null); // Initialize coin state as null

  const { currency, symbol } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  useEffect(() => {
    fetchCoin();
  }, [id]); // Add id to dependency array to refetch on id change

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down('md')]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down('md')]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "1px solid #fff",
    },
    coinImage: {
      marginBottom: 20,
    },
    loader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
  }));
  const classes = useStyles();

  if (!coin) {
    return (
      <div className={classes.loader}>
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        {coin.image && (
          <img
            src={coin.image.large}
            alt={coin.name}
            height="200"
            className={classes.coinImage}
          />
        )}
        <h3>{coin.name}</h3>
        <p>{coin.description?.en.split('. ')[0]}</p>
      </div>
      {/* Chart */}
      <CoinInfo coin={coin} />
    </div>
  );
};

export default CoinPage;
