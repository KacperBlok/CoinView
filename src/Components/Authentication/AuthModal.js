import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { AppBar, Button, Tabs, Tab } from '@material-ui/core';
import Login from './Login';
import SignUp from './SignUp';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10,
    
    
  },
}));

export default function AuthModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  console.log(value);

  return (
    <div>
      <Button 
        variant='Outlined'
        style={{
          flex: 1,
          backgroundColor: "gold",
          color: "black",
          width: 100,
          height: 40,
          fontSize: 20,
          fontFamily: "Montserrat",
          textTransform: "uppercase",
          
          
        }}
        onClick={handleOpen}

      
      >Login</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <AppBar 
            position='static'
            style={{ backgroundColor: "transparent", color:"white"}}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{ borderRadius: 10}}
              >
                <Tab label="Login" />
                <Tab label="Sign Up" /> 

              </Tabs>
                    </AppBar>

                    {value===0 && <Login handleClose= {handleClose}/>}
                    {value===1 && <SignUp handleClose= {handleClose}/>}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
