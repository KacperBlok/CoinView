import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Avatar, Button } from '@material-ui/core';
import { CryptoState } from '../../CryptoContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { numberWithCommas } from '../Banner/Carousel';
import { AiFillDelete } from 'react-icons/ai';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: '100%', 
    display: "flex",
    flexDirection: "column", 
    fontFamily: "Montserrat",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "90%",
  },
  picture: {
    height: 75,
    width: 75,
    borderRadius: "50%",
    backgroundColor: "#EEBC1D",
    cursor: "pointer",
  },
  logout: {
    height: 40,
    minWidth: 125,
    backgroundColor: "#EEBC1D",
    color: "#14161a",
    fontFamily: "Montserrat",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "white",
      color: "#14161a",
    },
  },
  watchlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "grey",
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overflowY: "scroll",
    height: "100%",
    boxSizing: "border-box",
  },
  coin: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1px solid #EEBC1D",
    borderRadius: 10,
    padding: 5,
    width: "100%",
    cursor: "pointer",
    backgroundColor: "white",
    color: "#14161a",
    "&:hover": {
      backgroundColor: "#EEBC1D",
    },
  }
});

export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const { user, setAlert, watchlist, coins, symbol } = CryptoState();
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const removeFromWatchlist = async (coin) => {
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

  const logout = () => {
    signOut(auth);

    setAlert({
      open: true,
      message: "Logout Successful",
      type: "success",
    });
  };

  const navigateToCoinPage = (coinId) => {
    navigate(`/coin/${coinId}`); // Navigate to the detailed coin page
  };

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar 
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 35,
              width: 35,
              cursor: "pointer",
              backgroundColor: "#EEBC1D",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email} 
          />
          
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    fontSize: 25,
                    width: "100%",
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <div className={classes.watchlist}>
                  <span style={{ fontSize: 12, textShadow: "0 0 5px gold" }}>
                    Watchlist
                  </span>
                  {coins.map(coin => {
                    if(watchlist.includes(coin.id))
                      return (
                    <div className={classes.coin} onClick={() => navigateToCoinPage(coin.id)}>
                        
                          <img src={coin.image} alt={coin.name} height="30" style={{ marginRight: 1 }} />
                          <span>{coin.name}</span>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>
                            {symbol}
                            {numberWithCommas(coin.current_price.toFixed(2))}
                            
                            <AiFillDelete
                            style={{
                                color: "black",
                                marginLeft: 10,
                                cursor: "pointer",
                              }}
                              fontSize="16"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent click event from bubbling up to the parent div
                                removeFromWatchlist(coin.id);
                              }}
                            />
                            </span>
                        </div>
                      );
                    return null;
                  })}
                </div>
              </div>
              <Button
                variant="contained"
                className={classes.logout}
                onClick={logout}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
