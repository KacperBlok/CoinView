import React, { useEffect, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { CryptoState } from '../../CryptoContext';
import { Link } from 'react-router-dom';
import AliceCarousel from 'react-alice-carousel';

const useStyles = makeStyles((theme) => ({
  carousel: {
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "white",
  },
}));

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const classes = useStyles();

  const { currency, symbol } = CryptoState();

  // Using useCallback to memoize the function
  const fetchTrendingCoins = useCallback(async () => {
    try {
      console.log(`Fetching trending coins for currency: ${currency}`);
      const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/trending?currency=${currency}`);
      setTrending(data);
    } catch (error) {
      console.error("Error fetching trending coins:", error);
    }
  }, [currency]); // Dependency array includes currency

  useEffect(() => {
    fetchTrendingCoins();
  }, [fetchTrendingCoins]); // Dependency array includes fetchTrendingCoins

  const items = trending.map((coin) => {
    const profit = coin.price_change_percentage_24h >= 0;

    return (
      <Link className={classes.carouselItem} to={`/coin/${coin.id}`} key={coin.id}>
        <img
          src={coin.image}
          alt={coin.name}
          height="80"
          style={{ marginBottom: 10 }}
        />
        <span>{coin.symbol}
          &nbsp;
          <span
            style={{
              color: profit ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 0, 0, 0.8)",
              fontWeight: 500,
            }}>
            {profit && "+"} {coin.price_change_percentage_24h.toFixed(2)}%
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol} {numberWithCommas(coin.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableButtonsControls
        disableDotsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </div>
  );
};

export default Carousel;
