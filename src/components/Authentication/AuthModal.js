import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { AppBar, Box, Button, Tab, Tabs } from '@material-ui/core';
import transitions from '@material-ui/core/styles/transitions';
import Login from './Login';
import SignUp from './SignUp';
import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../fierbase';
import { CryptoState } from '../../CryptoContext';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10,
    color: '#fff',
    width:400,
  },
  loginButton: {
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    backgroundColor: '#f0be2f',
    padding: 8,
    fontFamily: "Jost",
    cursor: 'pointer',
    marginLeft: 20,
    width: 100,
    "&:hover, &:focus": {
        background: '#ad8a24',
        transition: 'background-color 0.9s ease',
      },
    },
    google: {
      padding: 24,
      paddingTop: 0,
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      gap: 20,
      fontSize: 20,
    }
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

  const { setAlert } = CryptoState(); 

  const googleProvider = new GoogleAuthProvider()

  const singInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then(res => {
      setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${res.user.email}`,
        type: "success",
      });

      handleClose();
    })
    .catch((error) => {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
      return;
    });
  };

  return (
    <div>
      <Button variant='contained' onClick={handleOpen} className={classes.loginButton}>
        sign-up
      </Button>
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
            <AppBar position='static' style={{backgroundColor: 'transparent', color: '#fff'}}>
                <Tabs value={value} onChange={handleChange} variant='fullWidth' TabIndicatorProps={{style: {background:'#f0be2f'}}} style={{borderRadius: 10,}}>
                    <Tab label="Login" />
                    <Tab label="Sign Up"/>
                </Tabs>
            </AppBar>
            {value === 0 && <Login  handleClose={handleClose}/>}
            {value === 1 && <SignUp handleClose={handleClose}/>}
            <Box className={classes.google}>
                <span>OR</span>
                <GoogleButton style={{outline: "none", width: "100%"}} onClick={singInWithGoogle}/>
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}