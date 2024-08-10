import { Container, Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import Carousel from './Carousel';

const useStyles = makeStyles((theme) => ({
  banner: {
    backgroundImage: "url(./banner2.jpg)",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  bannerContent: {
    height: 400,
    display: "flex",
    flexDirection: "column",
    paddingTop: 25,
    justifyContent: "space-around",
  },
  tagline: {
    display: "flex",
    height: "40%",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  title: {
    fontFamily: "Montserrat",
    fontWeight: "bold",
    marginBottom: 15,
    fontSize: "clamp(3rem, 6vw, 5rem)", // Adjusts between 48px and 80px
  },
  subtitle: {
    color: "darkgrey",
    textTransform: "capitalize",
    fontFamily: "Montserrat",
    fontSize: "clamp(1rem, 2.5vw, 1.5rem)", // Adjusts between 16px and 24px
  },
}));

const Banner = () => {
  const classes = useStyles();

  return (
    <div className={classes.banner}>
      <Container className={classes.bannerContent}>
        <div className={classes.tagline}>
          <Typography className={classes.title} variant="h1">
            CoinView
          </Typography>
          <Typography className={classes.subtitle} variant="subtitle2">
            Get all the info regarding your favorite cryptocurrency
          </Typography>
        </div>
        <Carousel />
      </Container>
    </div>
  );
};

export default Banner;
