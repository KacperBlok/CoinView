import React from "react";
import { AppBar, Container, MenuItem, makeStyles, createTheme, Select, Toolbar, Typography, ThemeProvider } from "@material-ui/core";
import { useNavigate } from 'react-router-dom'; 
import { CryptoState } from "../CryptoContext";
import AuthModal from "./Authentication/AuthModal";

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: "gold",
    fontFamily: "Montserrat",
    fontWeight: "bold", 
    cursor: "pointer",
    fontSize: 30,
  },
}));

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate(); 

  const {currency, setCurrency} = CryptoState()

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
    <AppBar color="transparent" position="static">
      <Container>
        <Toolbar>
          <Typography
            onClick={() => navigate("/")} 
            className={classes.title}
            variant="h5"
          >
            CoinView
          </Typography>
          
          <Select
            variant="outlined"
            style={{
              width: 100,
              height: 40,
              marginRight: 10,
              marginLeft: 10,
            }}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <MenuItem value={"USD"}>USD</MenuItem>
            <MenuItem value={"EUR"}>EUR</MenuItem>
            <MenuItem value={"PLN"}>PLN</MenuItem>
          </Select>

          <AuthModal></AuthModal>
        </Toolbar>
      </Container>
    </AppBar>
  </ThemeProvider>
  );
};

export default Header;
