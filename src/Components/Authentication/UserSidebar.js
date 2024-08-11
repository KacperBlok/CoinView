import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Avatar, Button } from '@material-ui/core';
import { CryptoState } from '../../CryptoContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';


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
  }
});
export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const { user, setAlert } = CryptoState();

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const logout = () => {
    signOut(auth);

    setAlert({
      open: true,
      message: "Logout Successful",
      type: "success",
    });
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
