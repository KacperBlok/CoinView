import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import axios from 'axios';
import { Button, makeStyles, Typography } from '@material-ui/core';
import CoinInfo from '../Components/CoinInfo';
import { Oval } from 'react-loader-spinner';
import { numberWithCommas } from '../utils/helpers';
import HtmlReactParser from 'html-react-parser';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null); // Initialize coin state as null

  const { currency, symbol, user, watchlist, setAlert } = CryptoState();

  // Function to fetch coin details from local server
  const fetchCoinDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/coin-details?id=${id}&currency=${currency}`);
      setCoin(response.data);
    } catch (error) {
      console.error('Error fetching coin details:', error);
    }
  };

  useEffect(() => {
    fetchCoinDetails();
  }, [id, currency]); // Add currency to dependency array to refetch on currency change

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
    heading: {
      fontFamily: "Montserrat",
      fontSize: 20,
      color: "gold",
      fontWeight: "bold",
    },
    description: {
      fontFamily: "Montserrat",
      width: "100%",
      padding: 20,
      paddingBottom: 15,
      textAlign: "justify",
    },
    marketdata: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      // Responsive
      
      [theme.breakpoints.down('sm')]: {
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("md")]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down('xs')]: {
        alignItems: "start",
      },
    }

  }));

  const inWatchlist = watchlist?.includes(coin?.id);  

  const addtoWatchlist = async () => {
    if (!coin?.id || !user?.uid) {
      console.error("Invalid data: Cannot add to watchlist");
      return;
    }
  
    const coinRef = doc(db, "watchlist", user.uid);
  
    try {
      await setDoc(coinRef, {
        coins: watchlist ? [...watchlist, coin.id] : [coin.id],
      });
  
      setAlert({
        open: true,
        message: `${coin.name} added to watchlist`,
        type: "success",
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      setAlert({
        open: true,
        message: `Error adding ${coin.name} to watchlist`,
        type: "error",
      });
    }
  };

  const removeFromWathclist = async () => {
    if (!coin?.id || !user?.uid) {
      console.error("Invalid data: Cannot remove from watchlist");
      return;
    }

    const coinRef = doc(db, "watchlist", user.uid);

    try {
      await setDoc(coinRef, {
        coins: watchlist?.filter((watch) => watch !== coin?.id),
      }, 
      { merge: true }
    );

      setAlert({
        open: true,
        message: `${coin.name} removed from watchlist`,
        type: "success",
      });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      setAlert({
        open: true,
        message: `Error removing ${coin.name} from watchlist`,
        type: "error",
      });
    }
  };
  

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
        <Typography variant='h3' className={classes.heading}>
          {coin.name}
        </Typography>
        <Typography variant='body1' className={classes.description}>
          {HtmlReactParser(coin.description?.en
            ? coin.description.en.split('. ')[0] + '.' // First sentence of description
            : 'Description not available.')}
        </Typography>

        <div className={classes.marketdata}>
          <span style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            <Typography variant='h5' className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant='h5'
              style={{
                fontFamily: "Montserrat",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {coin.market_cap_rank}
            </Typography>
          </span>
          <span style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            <Typography variant='h5' className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant='h5'
              style={{
                fontFamily: "Montserrat",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {symbol}{" "}
              {coin.market_data?.current_price && numberWithCommas(coin.market_data.current_price[currency.toLowerCase()])}
            </Typography>
          </span>
          <span style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            <Typography variant='h5' className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant='h5'
              style={{
                fontFamily: "Montserrat",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {symbol}{" "}
              {coin.market_data?.market_cap && numberWithCommas(coin.market_data.market_cap[currency.toLowerCase()])}
            </Typography>
          </span>

          {user && (
            <Button
              variant='outlined'
              style={{
                backgroundColor: inWatchlist ? "red" : "#EEBC1D",
                color: "#000",
                fontFamily: "Montserrat",
                fontWeight: "bold",
                width: "100%",
                "&:hover": {
                  backgroundColor: "grey",
                }}}
                onClick={inWatchlist? removeFromWathclist :  addtoWatchlist}
            >
            {inWatchlist? "Remove from Watchlist": "Add to Watchlist"}
            </Button>
              
          )}
          
        </div>
      </div>
      {/* Chart */}
      <CoinInfo coin={coin} />
    </div>
  );
};

export default CoinPage;
